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
import { ObjetivosEspecificosService } from '@core/services/objetivos-especificos.service';

import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-objetivos-especificos-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './objetivos-especificos-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ObjetivosEspecificosFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  objetivosEspecificosService = inject(ObjetivosEspecificosService);

  editing = input.required<boolean>();

  objetivoEspecifico = input<ObjetivoEspecifico>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.objetivoEspecifico()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<ObjetivoEspecifico> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.objetivosEspecificosService.actualizar(
          this.objetivoEspecifico()!.id,
          payload
        )
      : this.objetivosEspecificosService.crear(payload);

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
