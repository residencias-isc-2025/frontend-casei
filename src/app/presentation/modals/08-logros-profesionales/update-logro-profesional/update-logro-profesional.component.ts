import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LogrosPrefesionalesResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-logro-profesional',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-logro-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateLogroProfesionalComponent implements OnInit {
  title = input('');
  logroProfesional = input.required<LogrosPrefesionalesResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateLogroProfesionalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateLogroProfesionalForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateLogroProfesionalForm.patchValue({
      descripcion: this.logroProfesional().descripcion,
    });
  }

  onSaveData() {
    const { descripcion } = this.updateLogroProfesionalForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarLogroProfesional(this.logroProfesional().id, {
        accessToken: token,
        descripcion,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.toastService.showSuccess(res.mensaje!, 'Éxito');
            this.onSave.emit();
          } else {
            this.toastService.showWarning(res.mensaje!, 'Malas noticias');
          }
        },
      });
  }
}
