import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Periodo } from '@core/models/periodo.model';
import { ClaseService } from '@core/services/clase.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-select-periodo-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './select-periodo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectPeriodoFormComponent {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);

  toastService = inject(ToastService);
  claseService = inject(ClaseService);

  idClase = input.required<number>();
  periodos = input.required<Periodo[]>();

  form = this.fb.group({
    periodo: [0, Validators.required],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const { periodo } = this.form.value;

    this.claseService.migrarClase(this.idClase(), periodo!).subscribe({
      next: () => {
        this.toastService.showSuccess('Clase migrada correctamente', 'Éxito');
        this.onSave.emit();
      },
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
    });
  }
}
