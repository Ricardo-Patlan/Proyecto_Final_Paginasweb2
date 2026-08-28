import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Loan } from '../interfaces/loan.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class LoansService {
  private http = inject(HttpClient);

  // Pide prestado un libro para el usuario autenticado (el interceptor
  // agrega el token; el backend identifica al usuario por ese token).
  create(bookId: string): Observable<Loan> {
    return this.http.post<Loan>(`${baseUrl}/loans`, { bookId });
  }

  getMine(offset = 0, limit = 5): Observable<Loan[]> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<Loan[]>(`${baseUrl}/loans/mine`, { params });
  }

  // Solo admin: todos los prestamos de todos los usuarios.
  getAll(offset = 0, limit = 5): Observable<Loan[]> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<Loan[]>(`${baseUrl}/loans`, { params });
  }

  // Solo admin: marca un prestamo como devuelto.
  markAsReturned(id: string): Observable<Loan> {
    return this.http.patch<Loan>(`${baseUrl}/loans/${id}/return`, {});
  }
}
