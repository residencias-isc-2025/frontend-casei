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
import { ToastService, UsersService } from '@presentation/services';
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

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

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
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.changePassword(token, newPassword).subscribe({
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.onSave.emit();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Error');
        }
      },
      error: (err) => {
        this.toastService.showError('Error al cambiar la contraseña', 'Error');
      },
    });
  }
}
