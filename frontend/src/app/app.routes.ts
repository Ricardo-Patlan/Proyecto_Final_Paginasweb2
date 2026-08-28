import { Routes } from '@angular/router';
import { HomePage } from './home/home-page';
import { isAuthenticatedGuard } from './auth/guards/is-authenticated.guard';
import { isAdminGuard } from './auth/guards/is-admin.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: '',
    component: HomePage,
  },
  {
    // protegida con isAuthenticatedGuard: solo usuarios logueados.
    path: 'loans/mine',
    canActivate: [isAuthenticatedGuard],
    loadComponent: () => import('./loans/pages/my-loans-page/my-loans-page').then((m) => m.MyLoansPage),
  },
  {
    // protegida con isAdminGuard: solo el rol admin puede entrar aqui.
    path: 'loans',
    canActivate: [isAdminGuard],
    loadComponent: () => import('./loans/pages/all-loans-page/all-loans-page').then((m) => m.AllLoansPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
