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
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./presentation/pages/users-page/users-page.component'),
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
