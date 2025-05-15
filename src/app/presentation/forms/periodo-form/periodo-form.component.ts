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

@Component({
  selector: 'app-periodo-form',
  imports: [CommonModule, ReactiveFormsModule],
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

  hoy: string = '';

  form = this.fb.group({
    descripcion: ['', Validators.required],
    clave: ['', Validators.required],
    fecha_i: ['', Validators.required],
    fecha_f: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) {
      this.hoy = new Date().toISOString().split('T')[0];

      this.form.patchValue({
        fecha_i: this.hoy,
        fecha_f: this.hoy,
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

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Periodo> = {
      descripcion: formValue.descripcion ?? '',
      clave: formValue.clave ?? '',
      fecha_inicio: formValue.fecha_i ?? '',
      fecha_fin: formValue.fecha_f ?? '',
    };

    const action = this.editing()
      ? this.periodoService.actualizar(this.periodo()!.id, payload)
      : this.periodoService.crear(payload);

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
