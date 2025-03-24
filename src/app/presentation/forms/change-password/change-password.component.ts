import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '@core/services/user.service';
import { ToastService } from '@core/services/toast.service';
import { passwordMatchValidator } from '@validators/index';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  onCancel = output();
  onSave = output();

  toastService = inject(ToastService);
  userService = inject(UserService);

  changePasswordForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group(
      {
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  onSaveData() {
    if (this.changePasswordForm.invalid) return;

    const { newPassword } = this.changePasswordForm.value;

    this.userService.cambiarPassword(newPassword).subscribe({
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.onSave.emit();
      },
      error: () => {
        this.toastService.showError('Error al cambiar la contraseña', 'Error');
      },
    });
  }
}
