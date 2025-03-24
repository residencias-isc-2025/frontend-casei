import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserFormComponent {
  isUserRole = signal(false);

  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  userService = inject(UserService);

  form = this.fb.group({
    nomina: [
      '',
      [Validators.required, Validators.pattern(/^\d{2}(0[1-9]|1[0-2])\d{2}$/)],
    ],
    rol: ['', Validators.required],
    tipo: [''],
  });

  onRoleChanged() {
    const selectedRole = this.form.get('rol')?.value;
    this.isUserRole.set(selectedRole === 'user');

    if (this.isUserRole()) {
      this.form.get('tipo')?.setValidators([Validators.required]);
    } else {
      this.form.get('tipo')?.clearValidators();
    }

    this.form.get('tipo')?.updateValueAndValidity();
  }

  onCreateUser() {
    const { nomina, rol, tipo } = this.form.value;

    this.userService
      .crearUsuario({
        username: nomina!,
        password: nomina!,
        role: rol!,
        tipo_docente: tipo,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.onSave.emit();
        },
      });
  }
}
