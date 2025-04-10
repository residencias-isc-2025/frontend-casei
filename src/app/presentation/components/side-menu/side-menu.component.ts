import { CommonModule, formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export enum TitleColor {
  red = 'text-red-500',
  green = 'text-green-500',
  blue = 'text-blue-500',
  purple = 'text-purple-500',
}

interface MenuOptions {
  routerLink: string;
  icon: string;
  routeName: string;
}

@Component({
  selector: 'app-side-menu',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './side-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent {
  title = input('Residencias');
  userRole = input.required();

  date = signal(formatDate(new Date(), 'yyyy', 'en-US'));

  titleColor = input<TitleColor>(TitleColor.blue);

  onLogout = output();

  rutasComunes: MenuOptions[] = [
    {
      icon: 'fas fa-user',
      routeName: 'Perfil',
      routerLink: '/dashboard/perfil',
    },
    {
      icon: 'fas fa-file',
      routeName: 'Formatos',
      routerLink: '/dashboard/formatos',
    },
  ];

  rutasProtegidas: MenuOptions[] = [
    {
      icon: 'fas fa-users',
      routeName: 'usuarios',
      routerLink: '/dashboard/usuarios',
    },
    {
      icon: 'fas fa-university',
      routeName: 'Instituciones',
      routerLink: '/dashboard/instituciones',
    },
    {
      icon: 'fas fa-paperclip',
      routeName: 'Adscripciones',
      routerLink: '/dashboard/adscripciones',
    },
    {
      icon: 'fas fa-calendar-alt',
      routeName: 'Periodos',
      routerLink: '/dashboard/periodos',
    },
    {
      icon: 'fas fa-bullseye',
      routeName: 'Objetivos específicos',
      routerLink: '/dashboard/objetivos-especificos',
    },
    {
      icon: 'fas fa-file-alt',
      routeName: 'Atributos de egreso',
      routerLink: '/dashboard/atributos-egreso',
    },
    {
      icon: 'fas fa-graduation-cap',
      routeName: 'Criterios de desempeño',
      routerLink: '/dashboard/criterios',
    },
    {
      icon: 'fas fa-book-open',
      routeName: 'Estrategias de enseñanza',
      routerLink: '/dashboard/estrategias-ensenanza',
    },
    {
      icon: 'fas fa-check-circle',
      routeName: 'Estrategias de evaluación',
      routerLink: '/dashboard/estrategias-evaluacion',
    },
    {
      icon: 'fas fa-tools',
      routeName: 'Prácticas',
      routerLink: '/dashboard/practicas',
    },
    {
      icon: 'fas fa-puzzle-piece',
      routeName: 'Temas',
      routerLink: '/dashboard/temas',
    },
    {
      icon: 'fas fa-book',
      routeName: 'Bibliografías',
      routerLink: '/dashboard/bibliografias',
    },
    {
      icon: 'fas fa-clipboard-list',
      routeName: 'Actividades de Aprendizaje',
      routerLink: '/dashboard/actividad-aprendizaje',
    },
    {
      icon: 'fas fa-handshake',
      routeName: 'Competencias Genéricas',
      routerLink: '/dashboard/competencias-genericas',
    },
    {
      icon: 'fas fa-signal',
      routeName: 'Indicadores de Alcance',
      routerLink: '/dashboard/indicador-alcance',
    },
    {
      icon: 'fas fa-tasks',
      routeName: 'Listas de cotejo',
      routerLink: '/dashboard/lista-cotejo',
    },
    {
      icon: 'fas fa-trophy',
      routeName: 'Nivel de desempeño',
      routerLink: '/dashboard/nivel-desempenio',
    },
  ];
}
