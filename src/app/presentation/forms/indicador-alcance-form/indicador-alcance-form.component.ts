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
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { IndicadorAlcanceService } from '@core/services/indicador-alcance.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-indicador-alcance-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './indicador-alcance-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicadorAlcanceFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  indicadorAlcanceService = inject(IndicadorAlcanceService);

  editing = input.required<boolean>();

  title = input('');
  indicadorAlcance = input<IndicadorAlcance>();

  form = this.fb.group({
    siglas: ['', Validators.required],
    descripcion: ['', Validators.required],
    valor: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.indicadorAlcance()?.descripcion,
      siglas: this.indicadorAlcance()?.siglas,
      valor: this.indicadorAlcance()?.valor,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<IndicadorAlcance> = {
      descripcion: formValue.descripcion ?? '',
      siglas: formValue.siglas ?? '',
      valor: formValue.valor ?? 0,
    };

    const action = this.editing()
      ? this.indicadorAlcanceService.actualizar(
          this.indicadorAlcance()!.id,
          payload
        )
      : this.indicadorAlcanceService.crear(payload);

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
