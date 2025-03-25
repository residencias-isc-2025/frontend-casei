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
import { ActualizacionDisciplinar } from '@core/models/actualizacion-disciplinar.model';
import { Institucion } from '@core/models/institucion.model';
import { ActualizacionDisciplinarService } from '@core/services/actualizacion-disciplinar.service';
import { ToastService } from '@core/services/toast.service';
import { validYearValidator } from '@validators/valid-year.validator';

@Component({
  selector: 'app-actualizacion-disciplinar-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actualizacion-disciplinar-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActualizacionDisciplinarFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  actualizacionDisciplinarService = inject(ActualizacionDisciplinarService);

  editing = input.required<boolean>();

  title = input('');
  instituciones = input.required<Institucion[]>();
  actualizacionDisciplinar = input<ActualizacionDisciplinar>();

  form = this.fb.group({
    tipo: ['', Validators.required],
    institucion: [0, Validators.required],
    obtencion: [0, [Validators.required, validYearValidator]],
    horas: [0],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      tipo: this.actualizacionDisciplinar()?.tipo_actualizacion,
      institucion: this.actualizacionDisciplinar()?.institucion_pais,
      obtencion: this.actualizacionDisciplinar()?.anio_obtencion,
      horas: this.actualizacionDisciplinar()?.horas,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<ActualizacionDisciplinar> = {
      anio_obtencion: formValue.obtencion ?? 0,
      institucion_pais: formValue.institucion ?? 0,
      horas: formValue.horas ?? 0,
      tipo_actualizacion: formValue.tipo ?? '',
    };

    const action = this.editing()
      ? this.actualizacionDisciplinarService.actualizar(
          this.actualizacionDisciplinar()!.id,
          payload
        )
      : this.actualizacionDisciplinarService.crear(payload);

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
