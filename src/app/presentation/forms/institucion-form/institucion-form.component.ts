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
import { Institucion } from '@core/models/institucion.model';
import { InstitucionService } from '@core/services/institucion.service';
import { ToastService } from '@core/services/toast.service';
import { Countries } from '@core/models/countries.model';

@Component({
  selector: 'app-institucion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './institucion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitucionFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);

  editing = input.required<boolean>();

  countriesList = input<Countries[]>([]);
  institucion = input<Institucion>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    pais: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      nombre: this.institucion()?.nombre_institucion,
      pais: this.institucion()?.pais,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Institucion> = {
      nombre_institucion: formValue.nombre ?? '',
      pais: formValue.pais ?? '',
    };

    const action = this.editing()
      ? this.institucionService.actualizar(
          this.institucion()!.id,
          payload
        )
      : this.institucionService.crear(payload);

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
