import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginPageComponent {
  public authService = inject(AuthService);

  myForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      nomina: ['', [Validators.required, Validators.minLength(6)]],
      cip: ['', [Validators.required]],
    });
  }

  handleLogin() {
    if (this.myForm.invalid) {
      console.log('FORMULARIO INVÁLIDO');
      return;
    }

    const { nomina, cip } = this.myForm.value;

    this.authService.login(nomina, cip).subscribe({
      next: (res) => console.log(res.mensaje),
      error: (res) => console.error(res.mensaje),
    });
  }
}
