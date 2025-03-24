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
import { Periodo } from '@core/models/periodo.model';
import { PeriodoService } from '@core/services/periodo.service';
import { ToastService } from '@core/services/toast.service';
import { formatedBirthdate } from '@helpers/formated-birthdate.helper';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-periodo-form',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './periodo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PeriodoFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  periodoService = inject(PeriodoService);

  editing = input.required<boolean>();

  periodo = input<Periodo>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
    clave: ['', Validators.required],
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
      const startDate = new Date(this.periodo()!.fecha_inicio)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(this.periodo()!.fecha_fin)
        .toISOString()
        .split('T')[0];

      this.form.patchValue({
        descripcion: this.periodo()?.descripcion,
        clave: this.periodo()?.clave,
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
    const payload: Partial<Periodo> = {
      descripcion: formValue.descripcion ?? '',
      clave: formValue.clave ?? '',
      fecha_inicio: new Date(formatedBirthdate(formValue.fecha_i ?? '')),
      fecha_fin: new Date(formatedBirthdate(formValue.fecha_f ?? '')),
    };

    const action = this.editing()
      ? this.periodoService.actualizarPeriodo(this.periodo()!.id, payload)
      : this.periodoService.crearPeriodo(payload);

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
