import { Routes } from '@angular/router';
import { userRoleGuard } from '@core/guards/user-role.guard';

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
        path: 'alumnos',
        loadComponent: () =>
          import('@presentation/pages/alumno-page/alumno-page.component'),
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
        path: 'atributos-egreso',
        loadComponent: () =>
          import(
            '@presentation/pages/atributo-egreso-page/atributo-egreso-page.component'
          ),
      },
      {
        path: 'criterios',
        loadComponent: () =>
          import('@presentation/pages/criterios-page/criterios-page.component'),
      },
      {
        path: 'estrategias-ensenanza',
        loadComponent: () =>
          import(
            '@presentation/pages/estrategia-ensenanza-page/estrategia-ensenanza-page.component'
          ),
      },
      {
        path: 'estrategias-evaluacion',
        loadComponent: () =>
          import(
            '@presentation/pages/estrategia-evaluacion-page/estrategia-evaluacion-page.component'
          ),
      },
      {
        path: 'practicas',
        loadComponent: () =>
          import('@presentation/pages/practicas-page/practicas-page.component'),
      },
      {
        path: 'temas',
        loadComponent: () =>
          import('@presentation/pages/tema-page/tema-page.component'),
      },
      {
        path: 'subtemas',
        loadComponent: () =>
          import('@presentation/pages/subtemas-page/subtemas-page.component'),
      },
      {
        path: 'formatos',
        loadComponent: () =>
          import('@presentation/pages/formats-page/formats-page.component'),
      },
      {
        path: 'bibliografias',
        loadComponent: () =>
          import(
            '@presentation/pages/bibliografia-page/bibliografia-page.component'
          ),
      },
      {
        path: 'actividad-aprendizaje',
        loadComponent: () =>
          import(
            '@presentation/pages/actividad-aprendizaje-page/actividad-aprendizaje-page.component'
          ),
      },
      {
        path: 'competencias-genericas',
        loadComponent: () =>
          import(
            '@presentation/pages/competencia-generica-page/competencia-generica-page.component'
          ),
      },
      {
        path: 'indicador-alcance',
        loadComponent: () =>
          import(
            '@presentation/pages/indicador-alcance-page/indicador-alcance-page.component'
          ),
      },
      {
        path: 'lista-cotejo',
        loadComponent: () =>
          import(
            '@presentation/pages/lista-cotejo-page/lista-cotejo-page.component'
          ),
      },
      {
        path: 'nivel-desempenio',
        loadComponent: () =>
          import(
            '@presentation/pages/nivel-desempenio-page/nivel-desempenio-page.component'
          ),
      },
      {
        path: 'competencias',
        loadComponent: () =>
          import(
            '@presentation/pages/competencias-page/competencias-page.component'
          ),
      },
      {
        path: 'materias',
        loadComponent: () =>
          import('@presentation/pages/materia-page/materia-page.component'),
      },
      {
        path: 'materias/add',
        loadComponent: () =>
          import(
            '@presentation/pages/materia-form-page/materia-form-page.component'
          ),
      },
      {
        path: 'materias/edit/:id',
        loadComponent: () =>
          import(
            '@presentation/pages/materia-form-page/materia-form-page.component'
          ),
      },
      {
        path: 'carrera',
        loadComponent: () =>
          import('@presentation/pages/carrera-page/carrera-page.component'),
      },
      {
        path: 'carrera/add',
        loadComponent: () =>
          import(
            '@presentation/pages/carrera-form-page/carrera-form-page.component'
          ),
      },
      {
        path: 'carrera/edit/:id',
        loadComponent: () =>
          import(
            '@presentation/pages/carrera-form-page/carrera-form-page.component'
          ),
      },
      {
        path: 'clase',
        loadComponent: () =>
          import('@presentation/pages/clase-page/clase-page.component'),
      },
      {
        path: 'clase/add',
        loadComponent: () =>
          import(
            '@presentation/pages/clase-form-page/clase-form-page.component'
          ),
      },
      {
        path: 'clase/edit/:id',
        loadComponent: () =>
          import(
            '@presentation/pages/clase-form-page/clase-form-page.component'
          ),
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
