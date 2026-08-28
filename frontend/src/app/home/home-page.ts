import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { BooksService } from '../books/services/books.service';
import { Book } from '../books/interfaces/book.interface';
import { LoansService } from '../loans/services/loans.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  authService = inject(AuthService);
  private booksService = inject(BooksService);
  private loansService = inject(LoansService);

  // estado de carga/error como signals para reflejarlos directo en el template.
  books = signal<Book[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  // id del libro que se esta pidiendo prestado en este momento (para
  // deshabilitar solo ese boton mientras se espera la respuesta).
  borrowingId = signal<string | null>(null);
  borrowMessage = signal<string | null>(null);

  constructor() {
    this.fetchBooks();
  }

  private fetchBooks() {
    this.loading.set(true);
    this.error.set(null);

    this.booksService.getAll().subscribe({
      next: (books) => {
        this.books.set(books);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los libros');
        this.loading.set(false);
      },
    });
  }

  borrow(book: Book) {
    this.borrowingId.set(book.id);
    this.borrowMessage.set(null);

    this.loansService.create(book.id).subscribe({
      next: () => {
        this.borrowingId.set(null);
        this.borrowMessage.set(`Pediste prestado "${book.title}"`);
        // se vuelve a pedir la lista para reflejar el stock actualizado.
        this.fetchBooks();
      },
      error: (err) => {
        this.borrowingId.set(null);
        // el backend a veces manda el mensaje como string y a veces como
        // arreglo (errores de validacion), aqui se normaliza a un string.
        const message = err.error?.message;
        this.borrowMessage.set(Array.isArray(message) ? message[0] : (message ?? 'No se pudo completar el préstamo'));
      },
    });
  }
}
