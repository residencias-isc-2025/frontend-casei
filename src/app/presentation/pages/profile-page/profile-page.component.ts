import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

// Modals
import {
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
  UpdateTeacherNameComponent,
  ChangePasswordComponent,
} from '@modals/index';

// Services
import { ToastService, UsersService } from '@services/index';
import { UserResponse } from '@interfaces/index';
import { Router } from '@angular/router';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [
    CommonModule,
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
    UpdateTeacherNameComponent,
    ChangePasswordComponent,
  ],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent implements OnInit {
  user = signal<UserResponse | null>(null);
  selectedId = signal<number>(-1);

  showPasswordModal = signal(false);
  showUpdateModal = signal(false);

  router = inject(Router);
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

    this.usersService.getLoggedUser(token).subscribe({
      error: (err) => {
        this.toastService.showError(
          err.mensaje || 'Error al cargar datos',
          'Malas noticias'
        );
      },
      next: (resp) => {
        localStorage.setItem('user-role', resp.usuario!.role);

        this.user.set(resp.usuario!);
      },
    });
  }

  cleanRole(): string {
    const role = this.user()?.role;
    return role === 'superuser'
      ? 'Super usuario'
      : role === 'admin'
      ? 'Administrador'
      : 'Docente';
  }

  handleClick(id: number) {
    switch (id) {
      case 1: this.router.navigateByUrl('/dashboard/formacion-academica'); break;
    }
  }

  onSaveEmit(): void {
    this.selectedId.set(-1);
  }

  onUpdateInfoEmit(): void {
    this.loadUserInfo();
    this.showUpdateModal.set(false);
  }

  onChangePasswordEmit(): void {
    this.showPasswordModal.set(false);
  }
}
