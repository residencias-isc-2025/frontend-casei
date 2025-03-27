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
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { EstrategiaEvaluacion } from '@core/models/estrategia-evaluacion.model';
import { Practica } from '@core/models/practica.model';
import { Tema } from '@core/models/tema.model';
import { TemaService } from '@core/services/tema.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-tema-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tema-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  temaService = inject(TemaService);

  title = input<string>('');
  editing = input.required<boolean>();

  criteriosDesempenoList = input.required<CriterioDesempenio[]>();
  estrategiaEnsenanzaList = input.required<EstrategiaEnsenanza[]>();
  estrategiaEvaluacionList = input.required<EstrategiaEvaluacion[]>();
  practicasList = input.required<Practica[]>();

  tema = input<Tema>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    objetivo: ['', Validators.required],
    criterio_desempeno: [0],
    estrategia_ensenanza: [0, Validators.required],
    estrategia_evaluacion: [0, Validators.required],
    practica: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      ...this.tema(),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const fromValue = this.form.value;

    const payload: Partial<Tema> = {
      nombre: fromValue.nombre ?? '',
      objetivo: fromValue.objetivo ?? '',
      criterio_desempeno: fromValue.criterio_desempeno,
      estrategia_ensenanza: fromValue.estrategia_ensenanza ?? 0,
      estrategia_evaluacion: fromValue.estrategia_evaluacion ?? 0,
      practica: fromValue.practica ?? 0,
    };

    const action = this.editing()
      ? this.temaService.actualizar(this.tema()!.id, payload)
      : this.temaService.crear(payload);

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
