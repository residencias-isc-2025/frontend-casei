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
        path: 'usuarios',
        loadComponent: () =>
          import('@presentation/pages/users-page/users-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'instituciones',
        loadComponent: () =>
          import('@presentation/pages/schools-page/schools-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'adscripciones',
        loadComponent: () =>
          import('@presentation/pages/enrolled-page/enrolled-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'periodos',
        loadComponent: () =>
          import('@presentation/pages/periodos-page/periodos-page.component'),
        canMatch: [userRoleGuard],
      },
      {
        path: 'perfil',
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
        path: 'experiencia-profesional',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/experiencia-profesional/experiencia-profesional.component'
          ),
      },
      {
        path: 'diseno-ingenieril',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/diseno-ingenieril/diseno-ingenieril.component'
          ),
      },
      {
        path: 'logros-profesionales',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/logros-profesionales/logros-profesionales.component'
          ),
      },
      {
        path: 'participacion',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/participacion/participacion.component'
          ),
      },
      {
        path: 'premios',
        loadComponent: () =>
          import('@presentation/pages/profile/premios/premios.component'),
      },
      {
        path: 'aportaciones',
        loadComponent: () =>
          import(
            '@presentation/pages/profile/aportaciones/aportaciones.component'
          ),
      },
      {
        path: 'objetivos-especificos',
        loadComponent: () =>
          import(
            '@presentation/pages/objetivos-especificos-page/objetivos-especificos-page.component'
          ),
      },
      {
        path: 'criterios',
        loadComponent: () =>
          import('@presentation/pages/criterios-page/criterios-page.component'),
      },
      {
        path: 'formatos',
        loadComponent: () =>
          import('@presentation/pages/formats-page/formats-page.component'),
      },
      {
        path: '**',
        redirectTo: 'perfil',
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
