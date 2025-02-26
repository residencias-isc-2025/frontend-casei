import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent {
  user = {
    name: 'Sergio Barreras',
    nomina: '990837',
    role: 'superuser',
  };

  buttons: ProfileButtons[] = [
    { id: 1, text: 'Formación académica', action: () => this.handleClick(1) },
    { id: 2, text: 'Capacitación docente', action: () => this.handleClick(2) },
    {
      id: 3,
      text: 'Actualización disciplinar',
      action: () => this.handleClick(3),
    },
    { id: 4, text: 'Gestión académica', action: () => this.handleClick(4) },
    { id: 5, text: 'Productos académicos', action: () => this.handleClick(5) },
    {
      id: 6,
      text: 'Experiencia profesional',
      action: () => this.handleClick(6),
    },
    { id: 7, text: 'Diseño ingenieril', action: () => this.handleClick(7) },
    { id: 8, text: 'Logros profesionales', action: () => this.handleClick(8) },
    {
      id: 9,
      text: 'Participación en asociaciones',
      action: () => this.handleClick(9),
    },
    {
      id: 10,
      text: 'Premios y reconocimientos',
      action: () => this.handleClick(10),
    },
    {
      id: 11,
      text: 'Aportaciones relevantes',
      action: () => this.handleClick(11),
    },
  ];

  handleClick(id: number) {
    console.log(id);
  }
}
