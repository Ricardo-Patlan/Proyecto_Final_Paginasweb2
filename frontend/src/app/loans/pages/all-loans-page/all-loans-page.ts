import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { LoansService } from '../../services/loans.service';
import { Loan } from '../../interfaces/loan.interface';

@Component({
  selector: 'app-all-loans-page',
  templateUrl: './all-loans-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllLoansPage {
  private loansService = inject(LoansService);

  loans = signal<Loan[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  // id del prestamo que se esta marcando como devuelto en este momento.
  returningId = signal<string | null>(null);

  constructor() {
    this.fetchLoans();
  }

  private fetchLoans() {
    this.loading.set(true);
    this.error.set(null);

    this.loansService.getAll().subscribe({
      next: (loans) => {
        this.loans.set(loans);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los préstamos');
        this.loading.set(false);
      },
    });
  }

  markAsReturned(loan: Loan) {
    this.returningId.set(loan.id);

    this.loansService.markAsReturned(loan.id).subscribe({
      next: () => {
        this.returningId.set(null);
        this.fetchLoans();
      },
      error: () => {
        this.returningId.set(null);
      },
    });
  }
}
