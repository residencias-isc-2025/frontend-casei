import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActividadAprendizaje } from '@core/models/actividad-aprendizaje.model';
import { ActividadAprendizajeService } from '@core/services/actividad-aprendizaje.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-actividad-aprendizaje-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad-aprendizaje-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadAprendizajeFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  actividadAprendizajeService = inject(ActividadAprendizajeService);

  editing = input.required<boolean>();

  title = input('');
  actividadAprendizaje = input<ActividadAprendizaje>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.actividadAprendizaje()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<ActividadAprendizaje> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.actividadAprendizajeService.actualizar(
          this.actividadAprendizaje()!.id,
          payload
        )
      : this.actividadAprendizajeService.crear(payload);

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
