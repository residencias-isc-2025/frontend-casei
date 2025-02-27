import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ToastService, UsersService } from '@services/index';
import { validYearValidator } from '@validators/index';

@Component({
  selector: 'app-academic-training',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './academic-training.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcademicTrainingComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addAcademicTrainingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addAcademicTrainingForm = this.fb.group({
      nivel: ['', Validators.required],
      nombre: ['', Validators.required],
      institucion: ['', Validators.required],
      obtencion: ['', [Validators.required, validYearValidator]],
      cedula: [''],
    });
  }

  onSaveData() {
    let { nivel, nombre, institucion, obtencion, cedula } =
      this.addAcademicTrainingForm.value;

    if (cedula === '') cedula = 'En proceso';

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addAcademicTrainingFunction({
        accessToken: token,
        code: cedula,
        institution: institucion,
        level: nivel,
        name: nombre,
        year: obtencion,
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
