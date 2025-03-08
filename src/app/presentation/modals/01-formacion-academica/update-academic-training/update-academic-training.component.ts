import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
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
import {
  FormacionAcademicaResponse,
  InstitucionesResponse,
} from '@interfaces/index';

@Component({
  selector: 'app-update-academic-training',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-academic-training.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAcademicTrainingComponent implements OnInit {
  title = input('');
  listaInstituciones = input.required<InstitucionesResponse[]>();
  formacionAcademica = input.required<FormacionAcademicaResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateAcademicTrainingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateAcademicTrainingForm = this.fb.group({
      nivel: ['', Validators.required],
      nombre: ['', Validators.required],
      institucion: ['', Validators.required],
      obtencion: ['', [Validators.required, validYearValidator]],
      cedula: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateAcademicTrainingForm.patchValue({
      nivel: this.formacionAcademica().nivel,
      nombre: this.formacionAcademica().nombre,
      institucion: this.formacionAcademica().id,
      obtencion: this.formacionAcademica().anio_obtencion,
      cedula: this.formacionAcademica().cedula_profesional,
    });
  }

  onSaveData() {
    let { nivel, nombre, institucion, obtencion, cedula } =
      this.updateAcademicTrainingForm.value;

    if (cedula === '') cedula = 'En proceso';

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .updateAcademicTrainingFunction(this.formacionAcademica().id, {
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
