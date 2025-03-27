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
import { EstrategiaEvaluacion } from '@core/models/estrategia-evaluacion.model';
import { EstrategiaEvaluacionService } from '@core/services/estrategia-evaluacion.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-estrategia-evaluacion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estrategia-evaluacion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstrategiaEvaluacionFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  estrategiaEvaluacionService = inject(EstrategiaEvaluacionService);

  editing = input.required<boolean>();

  title = input('');
  estrategiaEvaluacion = input<EstrategiaEvaluacion>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.estrategiaEvaluacion()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<EstrategiaEvaluacion> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.estrategiaEvaluacionService.actualizar(
          this.estrategiaEvaluacion()!.id,
          payload
        )
      : this.estrategiaEvaluacionService.crear(payload);

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
