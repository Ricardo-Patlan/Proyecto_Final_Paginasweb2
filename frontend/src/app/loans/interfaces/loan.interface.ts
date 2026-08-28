import { Book } from '../../books/interfaces/book.interface';
import { User } from '../../auth/interfaces/user.interface';

export type LoanStatus = 'active' | 'returned';

export interface Loan {
  id: string;
  book: Book;
  user: User;
  loanDate: string;
  returnDate: string | null;
  status: LoanStatus;
}
