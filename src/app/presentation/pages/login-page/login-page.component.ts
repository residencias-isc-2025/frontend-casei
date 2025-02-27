import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, ToastService } from '@services/index';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPageComponent {
  private router = inject(Router);

  public authService = inject(AuthService);
  public toastService = inject(ToastService);

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      nomina: ['', [Validators.required]],
      cip: ['', [Validators.required]],
    });
  }

  handleLogin() {
    if (this.myForm.invalid) {
      this.toastService.showWarning(
        'Por favor revisa la información ingresada.',
        'Formulario inválido'
      );
      return;
    }

    const { nomina, cip } = this.myForm.value;

    this.authService.login(nomina, cip).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          localStorage.setItem(
            'casei_residencias_access_token',
            res.tokens!.access!
          );
          localStorage.setItem(
            'casei_residencias_refresh_token',
            res.tokens!.refresh!
          );

          this.toastService.showSuccess(res.mensaje!, 'Bienvenido');
          this.router.navigateByUrl('/dashboard');
        } else {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }
}
