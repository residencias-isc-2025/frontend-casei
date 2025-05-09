import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';

export enum TitleColor {
  red = 'text-red-500',
  green = 'text-green-500',
  blue = 'text-blue-500',
  purple = 'text-purple-500',
  yellow = 'text-yellow-500',
  black = 'text-black',
}

interface MenuOptions {
  routerLink: string;
  icon: string;
  routeName: string;
}

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, SidebarLinkComponent],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  title = input('CACEI');
  userRole = input.required();

  date = signal(formatDate(new Date(), 'yyyy', 'en-US'));

  titleColor = input<TitleColor>(TitleColor.yellow);

  onLogout = output();

  rutasComunes: MenuOptions[] = [
    {
      icon: '/assets/svgs/user.svg',
      routeName: 'Perfil',
      routerLink: '/dashboard/perfil',
    },
    {
      icon: '/assets/svgs/apple.svg',
      routeName: 'Alumnos',
      routerLink: '/dashboard/alumnos',
    },
    {
      icon: '/assets/svgs/clipboard-text.svg',
      routeName: 'Formatos',
      routerLink: '/dashboard/formatos',
    },
  ];

  rutasProtegidas: MenuOptions[] = [
    {
      icon: '/assets/svgs/users.svg',
      routeName: 'usuarios',
      routerLink: '/dashboard/usuarios',
    },
    {
      icon: '/assets/svgs/school.svg',
      routeName: 'Instituciones',
      routerLink: '/dashboard/instituciones',
    },
    {
      icon: '/assets/svgs/adscripcion.svg',
      routeName: 'Adscripciones',
      routerLink: '/dashboard/adscripciones',
    },
    {
      icon: '/assets/svgs/periodo.svg',
      routeName: 'Periodos',
      routerLink: '/dashboard/periodos',
    },
    {
      icon: '/assets/svgs/objetivo-especifico.svg',
      routeName: 'Objetivos específicos',
      routerLink: '/dashboard/objetivos-especificos',
    },
    {
      icon: '/assets/svgs/atributo-egreso.svg',
      routeName: 'Atributos de egreso',
      routerLink: '/dashboard/atributos-egreso',
    },
    {
      icon: '/assets/svgs/criterio-desempeno.svg',
      routeName: 'Criterios de desempeño',
      routerLink: '/dashboard/criterios',
    },
    {
      icon: '/assets/svgs/estrategia-ensenanza.svg',
      routeName: 'Estrategias de enseñanza',
      routerLink: '/dashboard/estrategias-ensenanza',
    },
    {
      icon: '/assets/svgs/estrategia-evaluacion.svg',
      routeName: 'Estrategias de evaluación',
      routerLink: '/dashboard/estrategias-evaluacion',
    },
    {
      icon: '/assets/svgs/practica.svg',
      routeName: 'Prácticas',
      routerLink: '/dashboard/practicas',
    },
    {
      icon: '/assets/svgs/tema.svg',
      routeName: 'Temas',
      routerLink: '/dashboard/temas',
    },
    {
      icon: '/assets/svgs/subtema.svg',
      routeName: 'Subtemas',
      routerLink: '/dashboard/subtemas',
    },
    {
      icon: '/assets/svgs/bibliografia.svg',
      routeName: 'Bibliografías',
      routerLink: '/dashboard/bibliografias',
    },
    {
      icon: '/assets/svgs/actividad-aprendizaje.svg',
      routeName: 'Actividades de Aprendizaje',
      routerLink: '/dashboard/actividad-aprendizaje',
    },
    {
      icon: '/assets/svgs/competencia.svg',
      routeName: 'Competencias',
      routerLink: '/dashboard/competencias',
    },
    {
      icon: '/assets/svgs/competencia-generica.svg',
      routeName: 'Competencias Genéricas',
      routerLink: '/dashboard/competencias-genericas',
    },
    {
      icon: '/assets/svgs/indicador-alcance.svg',
      routeName: 'Indicadores de Alcance',
      routerLink: '/dashboard/indicador-alcance',
    },
    {
      icon: '/assets/svgs/lista-cotejo.svg',
      routeName: 'Listas de cotejo',
      routerLink: '/dashboard/lista-cotejo',
    },
    {
      icon: '/assets/svgs/nivel-desempeno.svg',
      routeName: 'Nivel de desempeño',
      routerLink: '/dashboard/nivel-desempenio',
    },
    {
      icon: '/assets/svgs/materia.svg',
      routeName: 'Materias',
      routerLink: '/dashboard/materias',
    },
    {
      icon: '/assets/svgs/carrera.svg',
      routeName: 'Carreras',
      routerLink: '/dashboard/carrera',
    },
    {
      icon: '/assets/svgs/clase.svg',
      routeName: 'Clases',
      routerLink: '/dashboard/clase',
    },
  ];
}
