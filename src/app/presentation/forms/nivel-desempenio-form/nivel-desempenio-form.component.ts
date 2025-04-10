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
import { NivelDesempenio } from '@core/models/nivel-desempenio.model';
import { NivelDesempenioService } from '@core/services/nivel-desempenio.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-nivel-desempenio-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nivel-desempenio-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NivelDesempenioFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  nivelDesempenioService = inject(NivelDesempenioService);

  title = input<string>('');
  editing = input.required<boolean>();
  indicadorAlcanceList = input.required<IndicadorAlcance[]>();
  nivelDesempenio = input<NivelDesempenio>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    valor: [0, Validators.required],
    indicador_alcance: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      ...this.nivelDesempenio(),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload: Partial<NivelDesempenio> = {
      nombre: formValue.nombre ?? '',
      valor: formValue.valor ?? 0,
      indicador_alcance: formValue.indicador_alcance ?? 0,
    };

    const action = this.editing()
      ? this.nivelDesempenioService.actualizar(
          this.nivelDesempenio()!.id,
          payload
        )
      : this.nivelDesempenioService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (response) => {
        this.toastService.showError(response.mensaje, 'Malas noticias');
      },
    });
  }
}
