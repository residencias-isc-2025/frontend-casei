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
import { ActividadAprendizaje } from '@core/models/actividad-aprendizaje.model';
import { CompetenciaGenerica } from '@core/models/competencia-generica.model';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { ListaCotejo } from '@core/models/lista-cotejo.model';
import { NivelDesempenio } from '@core/models/nivel-desempenio.model';
import { SubTemaService } from '@core/services/sub-tema.service';
import { ToastService } from '@core/services/toast.service';
import { SubTemas } from '../../../core/models/sub-temas.model';

@Component({
  selector: 'app-subtema-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './subtema-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtemaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  subtemaService = inject(SubTemaService);

  title = input<string>('');
  editing = input.required<boolean>();

  actividadAprendizajeList = input.required<ActividadAprendizaje[]>();
  estrategiasEnsenanzaList = input.required<EstrategiaEnsenanza[]>();
  competenciaGenericaList = input.required<CompetenciaGenerica[]>();
  indicadorAlcanceList = input.required<IndicadorAlcance[]>();
  nivelDesempenioList = input.required<NivelDesempenio[]>();
  listaCotejoList = input.required<ListaCotejo[]>();

  subtema = input<SubTemas>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
    horas: [0, Validators.required],
    actividad_aprendizaje: [0, Validators.required],
    estrategia_ensenanza: [0, Validators.required],
    competencia_generica: [0, Validators.required],
    indicador_alcance: [0, Validators.required],
    nivel_desempeno: [0, Validators.required],
    lista_cotejo: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      ...this.subtema(),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const fromValue = this.form.value;

    const payload: Partial<SubTemas> = {
      descripcion: fromValue.descripcion ?? '',
      horas: fromValue.horas ?? 0,
      actividad_aprendizaje: fromValue.actividad_aprendizaje ?? 0,
      estrategia_ensenanza: fromValue.estrategia_ensenanza ?? 0,
      competencia_generica: fromValue.competencia_generica ?? 0,
      indicador_alcance: fromValue.indicador_alcance ?? 0,
      nivel_desempeno: fromValue.nivel_desempeno ?? 0,
      lista_cotejo: fromValue.lista_cotejo ?? 0,
    };

    const action = this.editing()
      ? this.subtemaService.actualizar(this.subtema()!.id, payload)
      : this.subtemaService.crear(payload);

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
