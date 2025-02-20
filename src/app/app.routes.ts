import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import(
        './presentation/layouts/dashboard-layout/dashboard-layout.component'
      ),
  },
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
