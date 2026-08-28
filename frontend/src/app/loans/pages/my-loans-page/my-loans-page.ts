import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { LoansService } from '../../services/loans.service';
import { Loan } from '../../interfaces/loan.interface';

const PAGE_SIZE = 5;

@Component({
  selector: 'app-my-loans-page',
  imports: [DatePipe],
  templateUrl: './my-loans-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyLoansPage {
  private loansService = inject(LoansService);

  loans = signal<Loan[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  offset = signal(0);
  readonly pageSize = PAGE_SIZE;

  constructor() {
    // effect(): cada vez que offset() cambia (al pasar de pagina), se
    // vuelve a pedir la lista automaticamente, sin llamar a fetch a mano
    // desde next()/prev().
    effect(() => {
      this.fetchLoans(this.offset());
    });
  }

  private fetchLoans(offset: number) {
    this.loading.set(true);
    this.error.set(null);

    this.loansService.getMine(offset, this.pageSize).subscribe({
      next: (loans) => {
        this.loans.set(loans);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar tus préstamos');
        this.loading.set(false);
      },
    });
  }

  nextPage() {
    this.offset.update((current) => current + this.pageSize);
  }

  prevPage() {
    this.offset.update((current) => Math.max(0, current - this.pageSize));
  }
}
