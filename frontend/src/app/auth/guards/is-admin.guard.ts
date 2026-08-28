import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Guard funcional por rol: solo deja pasar si esta logueado Y tiene el rol
// admin. Protege, por ejemplo, la pantalla de "todos los prestamos".
export const isAdminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return toObservable(authService.authStatus).pipe(
    filter((status) => status !== 'checking'),
    take(1),
    map((status) => {
      if (status === 'authenticated' && authService.isAdmin()) return true;

      router.navigateByUrl('/');
      return false;
    }),
  );
};
