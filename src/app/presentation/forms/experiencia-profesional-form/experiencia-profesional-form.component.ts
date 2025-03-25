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
import { ExperienciaProfesional } from '@core/models/experiencia-profesional.model';
import { ExperienciaProfesionalService } from '@core/services/experiencia-profesional.service';
import { ToastService } from '@core/services/toast.service';
import { formatedBirthdate } from '@helpers/formated-birthdate.helper';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-experiencia-profesional-form',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './experiencia-profesional-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExperienciaProfesionalFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  experienciaProfesionalService = inject(ExperienciaProfesionalService);

  title = input('');
  editing = input.required<boolean>();

  experienciaProfesional = input<ExperienciaProfesional>();

  form = this.fb.group({
    puesto: ['', Validators.required],
    empresa: ['', Validators.required],
    fecha_i: ['', Validators.required],
    fecha_f: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) {
      const today = new Date().toISOString().split('T')[0];
      this.form.patchValue({
        fecha_i: today,
        fecha_f: today,
      });
    } else {
      const startDate = new Date(this.experienciaProfesional()!.d_mes_anio)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(this.experienciaProfesional()!.a_mes_anio)
        .toISOString()
        .split('T')[0];

      this.form.patchValue({
        puesto: this.experienciaProfesional()?.actividad_puesto,
        empresa: this.experienciaProfesional()?.organizacion_empresa,
        fecha_i: startDate ?? '',
        fecha_f: endDate ?? '',
      });
    }
  }

  onStartDateSelected(date: string) {
    this.form.get('fecha_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.form.get('fecha_f')?.setValue(date);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<ExperienciaProfesional> = {
      actividad_puesto: formValue.puesto ?? '',
      organizacion_empresa: formValue.empresa ?? '',
      d_mes_anio: new Date(formatedBirthdate(formValue.fecha_i ?? '')),
      a_mes_anio: new Date(formatedBirthdate(formValue.fecha_f ?? '')),
    };

    const action = this.editing()
      ? this.experienciaProfesionalService.actualizar(
          this.experienciaProfesional()!.id,
          payload
        )
      : this.experienciaProfesionalService.crear(payload);

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
