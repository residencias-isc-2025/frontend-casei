import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { CreateUserComponent } from '@modals/index';
import { ToastService, UsersService } from '@services/index';
import { UserResponse } from '@interfaces/index';

@Component({
  selector: 'app-users-page',
  imports: [CreateUserComponent],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  public showModal = signal(false);

  public users = signal<UserResponse[]>([]);

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.getAllUsers(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.users.set(res.usuarios || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los usuarios.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  resetPassword(userId: number): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.resetPassword(token, userId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onSaveEmit(): void {
    this.showModal.set(false);
    this.toastService.showInfo('Cargando usuarios', 'Por favor espere');
    this.loadUsers();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.toastService.showWarning(
        'No se seleccionó ningún archivo.',
        'Atención'
      );
      return;
    }

    const file = input.files[0];
    if (file.type !== 'text/csv') {
      this.toastService.showWarning(
        'El archivo debe ser de tipo CSV.',
        'Formato incorrecto'
      );
      return;
    }

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    const formData = new FormData();
    formData.append('archivo_csv', file);

    this.usersService.createUsersByCsv(token, formData).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadUsers();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }
}
