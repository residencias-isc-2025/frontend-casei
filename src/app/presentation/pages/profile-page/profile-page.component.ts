import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { combineLatest } from 'rxjs';

// Modals
import {
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
  AddTeacherNameComponent
} from '@modals/index';

// Interfaces
import { UserResponse, UserDataResponse } from '@interfaces/index';
// Services
import { ToastService, UsersService } from '@services/index';

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
    AddTeacherNameComponent
],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent implements OnInit {
  user = signal<CustomProfile | undefined>(undefined);
  selectedId = signal<number>(-1);

  showAddModal = signal(false);
  showUpdateModal = signal(false);

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

    combineLatest([
      this.usersService.getLoggedUser(token),
      this.usersService.getUserData(token),
    ]).subscribe({
      next: ([user, profile]) => {
        const userData = user.ok ? user.usuario : null;
        const profileData = profile.ok ? profile.usuario : null;

        if (userData) {
          localStorage.setItem('user-role', userData.role); // Guardamos el rol
        }

        if (userData || profileData) {
          this.user.set({ user: userData, profile: profileData });
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la información.',
            'Hubo un problema'
          );
        }
      },
      error: (err) => {
        this.toastService.showError(
          err.mensaje || 'Error al cargar datos',
          'Malas noticias'
        );
      },
    });
  }

  cleanRole(): string {
    const role = this.user()?.user?.role;
    return role === 'superuser'
      ? 'Super usuario'
      : role === 'admin'
      ? 'Administrador'
      : 'Docente';
  }

  handleClick(id: number) {
    this.selectedId.set(id);
  }

  onSaveEmit(): void {
    this.selectedId.set(-1);
  }

  onAddInfoSaveEmit(): void {
    this.loadUserInfo();
    this.showAddModal.set(false);
  }
}
