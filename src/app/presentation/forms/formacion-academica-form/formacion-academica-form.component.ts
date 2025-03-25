import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormacionAcademicaService } from '@core/services/formacion-academica.service';
import { ToastService } from '@core/services/toast.service';
import { validYearValidator } from '@validators/valid-year.validator';
import { FormacionAcademica } from '@core/models/formacion-academica.model';
import { Institucion } from '@core/models/institucion.model';

@Component({
  selector: 'app-formacion-academica-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formacion-academica-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormacionAcademicaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  formacionAcademicaService = inject(FormacionAcademicaService);

  editing = input.required<boolean>();

  title = input('');
  formacionAcademica = input<FormacionAcademica>();
  instituciones = input.required<Institucion[]>();

  form = this.fb.group({
    nivel: ['', Validators.required],
    nombre: ['', Validators.required],
    institucion: [0, Validators.required],
    obtencion: [0, [Validators.required, validYearValidator]],
    cedula: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      nivel: this.formacionAcademica()?.nivel,
      nombre: this.formacionAcademica()?.nombre,
      institucion: this.formacionAcademica()?.id,
      obtencion: this.formacionAcademica()?.anio_obtencion,
      cedula: this.formacionAcademica()?.cedula_profesional,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<FormacionAcademica> = {
      nombre: formValue.nombre ?? '',
      anio_obtencion: formValue.obtencion ?? 0,
      cedula_profesional: formValue.cedula ?? '',
      institucion_pais: formValue.institucion ?? 0,
      nivel: formValue.nivel ?? '',
    };

    const action = this.editing()
      ? this.formacionAcademicaService.actualizar(
          this.formacionAcademica()!.id,
          payload
        )
      : this.formacionAcademicaService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
    });
  }
}
