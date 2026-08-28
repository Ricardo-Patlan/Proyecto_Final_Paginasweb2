import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthResponse, User } from '../interfaces/user.interface';

const baseUrl = environment.baseUrl;

export type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // signals privados: solo el servicio los puede cambiar, afuera se leen
  // como readonly a traves de los computed de abajo.
  private _authStatus = signal<AuthStatus>('checking');
  private _user = signal<User | null>(null);

  authStatus = computed(() => this._authStatus());
  user = computed(() => this._user());
  isAdmin = computed(() => this._user()?.roles.includes('admin') ?? false);

  constructor() {
    // al levantar la app se revisa si ya habia un token guardado de una
    // sesion anterior.
    this.checkAuthStatus().subscribe();
  }

  register(email: string, password: string, fullName: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/register`, { email, password, fullName })
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  // login() solo regresa id/email/token; se encadena con checkAuthStatus()
  // para completar el perfil (fullName, roles) con un solo request extra.
  login(email: string, password: string): Observable<boolean> {
    return this.http.post<AuthResponse>(`${baseUrl}/auth/login`, { email, password })
      .pipe(
        switchMap((resp) => {
          localStorage.setItem('token', resp.token);
          return this.checkAuthStatus();
        }),
        catchError((error) => this.handleAuthError(error)),
      );
  }

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.logout();
      return of(false);
    }

    // de paso renueva el token, extendiendo la sesion.
    return this.http.get<AuthResponse>(`${baseUrl}/auth/check-status`)
      .pipe(
        map((resp) => this.handleAuthSuccess(resp)),
        catchError(() => this.handleAuthError(null)),
      );
  }

  logout() {
    this._user.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('token');
  }

  private handleAuthSuccess(resp: AuthResponse): boolean {
    this._user.set({
      id: resp.id,
      email: resp.email,
      fullName: resp.fullName ?? '',
      isActive: resp.isActive ?? true,
      roles: resp.roles ?? [],
    });
    this._authStatus.set('authenticated');
    localStorage.setItem('token', resp.token);

    return true;
  }

  private handleAuthError(_error: unknown): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
