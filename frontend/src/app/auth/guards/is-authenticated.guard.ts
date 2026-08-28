import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Guard funcional: protege rutas que exigen estar logueado. authStatus
// arranca en 'checking' mientras se valida el token guardado, por eso se
// espera (filter) a que ya no este 'checking' antes de decidir.
export const isAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.authStatus).pipe(
    filter((status) => status !== 'checking'),
    take(1),
    map((status) => {
      if (status === 'authenticated') return true;

      router.navigateByUrl('/auth/login');
      return false;
    }),
  );
};
