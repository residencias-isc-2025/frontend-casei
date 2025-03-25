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
import { GestionAcademica } from '@core/models/gestion-academica.model';
import { Institucion } from '@core/models/institucion.model';
import { GestionAcademicaService } from '@core/services/gestion-academica.service';
import { ToastService } from '@core/services/toast.service';
import { formatedBirthdate } from '@helpers/formated-birthdate.helper';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-gestion-academica-form',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './gestion-academica-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionAcademicaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  gestionAcademicaService = inject(GestionAcademicaService);

  editing = input.required<boolean>();

  title = input('');
  instituciones = input.required<Institucion[]>();
  gestionAcademica = input<GestionAcademica>();

  form = this.fb.group({
    puesto: ['', Validators.required],
    institucion: [0, Validators.required],
    gestion_i: ['', Validators.required],
    gestion_f: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) {
      const today = new Date().toISOString().split('T')[0];

      this.form.patchValue({
        gestion_i: today,
        gestion_f: today,
      });
    } else {
      const startDate = new Date(this.gestionAcademica()!.d_mes_anio)
        .toISOString()
        .split('T')[0];
      const endDate = new Date(this.gestionAcademica()!.a_mes_anio)
        .toISOString()
        .split('T')[0];

      this.form.patchValue({
        puesto: this.gestionAcademica()?.actividad_puesto,
        institucion: this.gestionAcademica()?.institucion_pais,
        gestion_i: startDate ?? '',
        gestion_f: endDate ?? '',
      });
    }
  }

  onStartDateSelected(date: string) {
    this.form.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.form.get('gestion_f')?.setValue(date);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<GestionAcademica> = {
      actividad_puesto: formValue.puesto ?? '',
      institucion_pais: formValue.institucion ?? 0,
      d_mes_anio: new Date(formatedBirthdate(formValue.gestion_i ?? '')),
      a_mes_anio: new Date(formatedBirthdate(formValue.gestion_f ?? '')),
    };

    const action = this.editing()
      ? this.gestionAcademicaService.actualizar(
          this.gestionAcademica()!.id,
          payload
        )
      : this.gestionAcademicaService.crear(payload);

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
