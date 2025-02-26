import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { ToastService, UsersService } from '../../services';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponent {
  isUserRole = signal(false);

  onCancel = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  createUserForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createUserForm = this.fb.group({
      nomina: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{2}(0[1-9]|1[0-2])\d{2}$/),
        ],
      ],
      rol: ['', Validators.required],
      tipo: [''],
    });
  }

  onRoleChanged() {
    const selectedRole = this.createUserForm.get('rol')?.value;
    this.isUserRole.set(selectedRole === 'user');

    if (this.isUserRole()) {
      this.createUserForm.get('tipo')?.setValidators([Validators.required]);
    } else {
      this.createUserForm.get('tipo')?.clearValidators();
    }

    this.createUserForm.get('tipo')?.updateValueAndValidity();
  }

  onCreateUser() {
    const { nomina, rol, tipo } = this.createUserForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .createUser({
        username: nomina,
        password: nomina,
        role: rol,
        type: tipo,
        accessToken: token,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.toastService.showSuccess(res.mensaje!, 'Éxito');
            this.onCancel.emit();
          } else {
            this.toastService.showWarning(res.mensaje!, 'Malas noticias');
          }
        },
      });
  }
}
