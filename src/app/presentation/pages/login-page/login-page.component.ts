import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPageComponent {
  fb = inject(FormBuilder);

  auth = inject(AuthService);
  toastService = inject(ToastService);

  router = inject(Router);

  myForm = this.fb.group({
    nomina: ['', [Validators.required]],
    cip: ['', [Validators.required]],
  });

  handleLogin() {
    if (this.myForm.invalid) {
      this.toastService.showWarning(
        'Por favor revisa la información ingresada.',
        'Formulario inválido'
      );
      return;
    }

    const { nomina, cip } = this.myForm.value;

    this.auth.login(nomina!, cip!).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Bienvenido');
        this.router.navigateByUrl('/dashboard');
      },
    });
  }
}
