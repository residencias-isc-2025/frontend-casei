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
import { CapacitacionDocente } from '@core/models/capacitacion-docente.model';
import { Institucion } from '@core/models/institucion.model';
import { CapacitacionDocenteService } from '@core/services/capacitacion-docente.service';
import { ToastService } from '@presentation/services';
import { validYearValidator } from '@validators/valid-year.validator';

@Component({
  selector: 'app-capacitacion-docente-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './capacitacion-docente-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapacitacionDocenteFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  capacitacionDocenteService = inject(CapacitacionDocenteService);

  editing = input.required<boolean>();

  title = input('');
  instituciones = input.required<Institucion[]>();
  capacitacionDocente = input<CapacitacionDocente>();

  form = this.fb.group({
    tipo: ['', Validators.required],
    institucion: [0, Validators.required],
    obtencion: [0, [Validators.required, validYearValidator]],
    horas: [0],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      tipo: this.capacitacionDocente()?.tipo_capacitacion,
      institucion: this.capacitacionDocente()?.institucion_pais,
      obtencion: this.capacitacionDocente()?.anio_obtencion,
      horas: this.capacitacionDocente()?.horas,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<CapacitacionDocente> = {
      anio_obtencion: formValue.obtencion ?? 0,
      institucion_pais: formValue.institucion ?? 0,
      horas: formValue.horas ?? 0,
      tipo_capacitacion: formValue.tipo ?? '',
    };

    const action = this.editing()
      ? this.capacitacionDocenteService.actualizar(
          this.capacitacionDocente()!.id,
          payload
        )
      : this.capacitacionDocenteService.crear(payload);

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
