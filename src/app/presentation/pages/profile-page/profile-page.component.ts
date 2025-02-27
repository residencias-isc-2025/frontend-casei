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
import { UserDataResponse } from '../../../interfaces/use-cases/user-data.response';
// Services
import { ToastService, UsersService } from '../../services';
import { combineLatestWith } from 'rxjs';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

interface CustomProfile {
  user?: UserResponse | null;
  profile?: UserDataResponse | null;
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
  user = signal<CustomProfile | undefined>(undefined);
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

  buttons: ProfileButtons[] = this.titles.map((title, index) => ({
    id: index + 1,
    text: title,
    action: () => this.handleClick(index + 1),
  }));

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .getLoggedUser(token)
      .pipe(combineLatestWith(this.usersService.getUserData(token)))
      .subscribe({
        next: ([user, profile]) => {
          if (user.ok && profile.ok) {
            this.user.set({
              user: user.usuario,
              profile: profile.usuario,
            });
          } else {
            this.toastService.showWarning(
              'No se pudo obtener la información.',
              'Hubo un problema'
            );
          }
        },
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
      });
  }

  cleanRole(): string {
    switch (this.user()?.user?.role) {
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
