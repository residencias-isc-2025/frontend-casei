import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

// Modals
import { AcademicTrainingComponent } from '../../modals/academic-training/academic-training.component';
import { TeachingTrainingComponent } from '../../modals/teaching-training/teaching-training.component';
import { DisciplinaryUpdateComponent } from '../../modals/disciplinary-update/disciplinary-update.component';
import { AcademicManagementComponent } from '../../modals/academic-management/academic-management.component';
import { AcademicProductsComponent } from '../../modals/academic-products/academic-products.component';
import { ProfessionalExperienceComponent } from '../../modals/professional-experience/professional-experience.component';
import { EngineeringDesignComponent } from '../../modals/engineering-design/engineering-design.component';
import { ProfessionalAchievementsComponent } from '../../modals/professional-achievements/professional-achievements.component';
import { AssociationsComponent } from '../../modals/associations/associations.component';
import { AwardsComponent } from '../../modals/awards/awards.component';
import { ContributionsComponent } from '../../modals/contributions/contributions.component';

// Interfaces
import { UserResponse } from '../../../interfaces/use-cases/user.response';
// Services
import { ToastService, UsersService } from '../../services';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
    AcademicTrainingComponent,
    TeachingTrainingComponent,
    DisciplinaryUpdateComponent,
    AcademicManagementComponent,
    AcademicProductsComponent,
    ProfessionalExperienceComponent,
    EngineeringDesignComponent,
    ProfessionalAchievementsComponent,
    AssociationsComponent,
    AwardsComponent,
    ContributionsComponent,
  ],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent implements OnInit {
  user = signal<UserResponse | null>(null);
  selectedId = signal<number>(-1);

  toastService = inject(ToastService);
  usersService = inject(UsersService);

  titles = [
    'Formación académica',
    'Capacitación docente',
    'Actualización disciplinar',
    'Gestión académica',
    'Productos académicos',
    'Experiencia profesional',
    'Diseño ingenieril',
    'Logros profesionales',
    'Participación en asociaciones',
    'Premios y reconocimientos',
    'Aportaciones relevantes',
  ];

  buttons: ProfileButtons[] = [
    { id: 1, text: this.titles[0], action: () => this.handleClick(1) },
    { id: 2, text: this.titles[1], action: () => this.handleClick(2) },
    { id: 3, text: this.titles[2], action: () => this.handleClick(3) },
    { id: 4, text: this.titles[3], action: () => this.handleClick(4) },
    { id: 5, text: this.titles[4], action: () => this.handleClick(5) },
    { id: 6, text: this.titles[5], action: () => this.handleClick(6) },
    { id: 7, text: this.titles[6], action: () => this.handleClick(7) },
    { id: 8, text: this.titles[7], action: () => this.handleClick(8) },
    { id: 9, text: this.titles[8], action: () => this.handleClick(9) },
    { id: 10, text: this.titles[9], action: () => this.handleClick(10) },
    { id: 11, text: this.titles[10], action: () => this.handleClick(11) },
  ];

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.getLoggedUser(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.user.set(res.usuario || null);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la información.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  cleanRole(): string {
    switch (this.user()?.role) {
      case 'superuser':
        return 'Super usuario';
      case 'admin':
        return 'Administrador';
      default:
        return 'Docente';
    }
  }

  handleClick(id: number) {
    this.selectedId.set(id);
  }

  onSaveEmit(): void {
    this.selectedId.set(-1);
  }
}
