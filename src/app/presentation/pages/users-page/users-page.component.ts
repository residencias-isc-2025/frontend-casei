import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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

  resetPassword(payrollNumber: string): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.resetPassword(token, payrollNumber).subscribe({
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
}
