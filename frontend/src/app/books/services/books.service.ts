import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Book } from '../interfaces/book.interface';

const baseUrl = environment.baseUrl;

@Injectable({ providedIn: 'root' })
export class BooksService {
  private http = inject(HttpClient);

  getAll(offset = 0, limit = 20): Observable<Book[]> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http.get<Book[]>(`${baseUrl}/books`, { params });
  }
}
