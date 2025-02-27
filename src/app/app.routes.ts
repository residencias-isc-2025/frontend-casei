import { Routes } from '@angular/router';
import { userRoleGuard } from './guards';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('./presentation/layouts/auth-layout/auth-layout.component'),
    children: [
      {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () =>
          import('./presentation/pages/login-page/login-page.component'),
      },
    ],
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () =>
      import(
        './presentation/layouts/dashboard-layout/dashboard-layout.component'
      ),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./presentation/pages/users-page/users-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./presentation/pages/profile-page/profile-page.component'),
      },
      {
        path: '**',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
