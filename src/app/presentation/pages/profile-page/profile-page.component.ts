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
  UpdateTeacherNameComponent,
  ChangePasswordComponent,
} from '@modals/index';

// Services
import {
  AdscripcionesService,
  CommonService,
  ToastService,
  UsersService,
} from '@services/index';
import { AdscripcionData, UserResponse } from '@interfaces/index';
import { Router } from '@angular/router';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, UpdateTeacherNameComponent, ChangePasswordComponent],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent implements OnInit {
  user = signal<UserResponse | null>(null);
  adscripcion = signal<AdscripcionData | null>(null);
  selectedId = signal<number>(-1);

  showPasswordModal = signal(false);
  showUpdateModal = signal(false);

  router = inject(Router);
  toastService = inject(ToastService);
  usersService = inject(UsersService);
  commonService = inject(CommonService);
  adscripcionesService = inject(AdscripcionesService);

  adscripcionesList = signal<AdscripcionData[]>([]);

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
    this.adscripcionesService.loadAdscripciones();
    this.adscripcionesService.getAdscripcion().subscribe((lista) => {
      this.adscripcionesList.set(lista);
    });

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

        if (!resp.usuario?.area_adscripcion) return;

        this.loadAdscripcion(token, resp.usuario.area_adscripcion);
      },
    });
  }

  loadAdscripcion(token: string, id: number): void {
    this.commonService.getAdscripcionById(id, token).subscribe({
      error: (err) => {
        this.toastService.showError(
          err.mensaje || 'Error al cargar datos',
          'Malas noticias'
        );
      },
      next: (resp) => {
        if (resp.ok) {
          this.adscripcion.set(resp.adscripcion!);
        } else {
          this.toastService.showWarning(
            'Error al cargar datos',
            'Malas noticias'
          );
        }
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
      case 1:
        this.router.navigateByUrl('/dashboard/formacion-academica');
        break;
      case 2:
        this.router.navigateByUrl('/dashboard/capacitacion-docente');
        break;
      case 3:
        this.router.navigateByUrl('/dashboard/actualizacion-disciplinar');
        break;
      case 4:
        this.router.navigateByUrl('/dashboard/gestion-academica');
        break;
      case 5:
        this.router.navigateByUrl('/dashboard/productos-academicos');
        break;
      case 6:
        this.router.navigateByUrl('/dashboard/experiencia-profesional');
        break;
      case 7:
        this.router.navigateByUrl('/dashboard/diseno-ingenieril');
        break;
      case 8:
        this.router.navigateByUrl('/dashboard/logros-profesionales');
        break;
      case 9:
        this.router.navigateByUrl('/dashboard/participacion');
        break;
      case 10:
        this.router.navigateByUrl('/dashboard/premios');
        break;
      case 11:
        this.router.navigateByUrl('/dashboard/aportaciones');
        break;
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
