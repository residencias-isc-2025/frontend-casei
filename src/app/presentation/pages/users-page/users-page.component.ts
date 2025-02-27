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
  public totalUsers = computed(() => this.users().length);

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

  onSaveEmit(): void {
    this.showModal.set(false);
    this.toastService.showInfo('Cargando usuarios', 'Por favor espere');
    this.loadUsers();
  }
}
