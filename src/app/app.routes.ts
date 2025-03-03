import { Routes } from '@angular/router';
import { userRoleGuard } from '@guards/index';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () =>
      import('@presentation/layouts/auth-layout/auth-layout.component'),
    children: [
      {
        path: 'login',
        title: 'Iniciar Sesión',
        loadComponent: () =>
          import('@presentation/pages/login-page/login-page.component'),
      },
    ],
  },
  {
    path: 'dashboard',
    title: 'Dashboard',
    loadComponent: () =>
      import(
        '@presentation/layouts/dashboard-layout/dashboard-layout.component'
      ),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('@presentation/pages/users-page/users-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('@presentation/pages/profile-page/profile-page.component'),
      },
      {
        path: 'formacion-academica',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/formacion-academica/formacion-academica.component'
          ),
      },
      {
        path: 'capacitacion-docente',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/capacitacion-docente/capacitacion-docente.component'
          ),
      },
      {
        path: 'actualizacion-disciplinar',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/actualizacion-disciplinar/actualizacion-disciplinar.component'
          ),
      },
      {
        path: 'gestion-academica',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/gestion-academica/gestion-academica.component'
          ),
      },
      {
        path: 'productos-academicos',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/productos-academicos/productos-academicos.component'
          ),
      },
      {
        path: 'formats',
        loadComponent: () =>
          import('@presentation/pages/formats-page/formats-page.component'),
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
