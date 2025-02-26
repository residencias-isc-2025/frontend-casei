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
        path: 'admin',
        loadComponent: () =>
          import('./presentation/pages/admin-page/admin-page.component'),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./presentation/pages/profile-page/profile-page.component'),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./presentation/pages/projects-page/projects-page.component'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
];
