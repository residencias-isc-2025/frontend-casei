import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

// Modals

// Services
import { ToastService } from '@services/index';
import { Router } from '@angular/router';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/user.service';
import { UpdateProfileComponent } from '@presentation/forms/update-profile/update-profile.component';
import { ChangePasswordComponent } from '@presentation/forms/change-password/change-password.component';
import { Adscripcion } from '@core/models/adscripcion.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { CommonService } from '@core/services/common.service';

interface ProfileButtons {
  id: number;
  text: string;
  action: () => void;
}

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, UpdateProfileComponent, ChangePasswordComponent],
  templateUrl: './profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ProfilePageComponent implements OnInit {
  user = signal<User | null>(null);
  adscripcion = signal<Adscripcion | null>(null);
  selectedId = signal<number>(-1);

  showPasswordModal = signal(false);
  showUpdateModal = signal(false);

  toastService = inject(ToastService);
  userService = inject(UserService);
  adscripcionService = inject(AdscripcionService);

  router = inject(Router);
  commonService = inject(CommonService);

  adscripcionesList = signal<Adscripcion[]>([]);

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
    this.adscripcionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        siglas: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          this.adscripcionesList.set(response.results);
        },
      });

    this.loadUserInfo();
  }

  loadUserInfo(): void {
    this.userService.obtenerPerfil().subscribe({
      error: (err) => {
        this.toastService.showError(
          err.mensaje || 'Error al cargar datos',
          'Malas noticias'
        );
      },
      next: (resp) => {
        localStorage.setItem('user-role', resp.role);
        this.user.set(resp);
        if (!resp.area_adscripcion) return;

        this.loadAdscripcion(resp.area_adscripcion);
      },
    });
  }

  loadAdscripcion(id: number): void {
    this.adscripcionService.obtenerAdscripcionPorId(id).subscribe({
      error: (err) => {
        this.toastService.showError(
          err.mensaje || 'Error al cargar datos',
          'Malas noticias'
        );
      },
      next: (resp) => {
        this.adscripcion.set(resp);
      },
    });
  }

  cleanRole(): string {
    return this.userService.limpiarRol(this.user()!);
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
