import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Competencia } from '@core/models/competencia.model';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { Tema } from '@core/models/tema.model';
import { CompetenciaService } from '@core/services/competencia.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-competencia-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competencia-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetenciaFormComponent {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  competenciaService = inject(CompetenciaService);

  title = input<string>('');
  editing = input.required<boolean>();

  objetivosEspecificosList = input.required<ObjetivoEspecifico[]>();
  temasList = input.required<Tema[]>();
  competencia = input<Competencia>();

  form = this.fb.group({
    objetivos_especificos: [0, Validators.required],
    temas: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      ...this.competencia(),
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const fromValue = this.form.value;

    const payload: Partial<Competencia> = {
      objetivos_especificos: fromValue.objetivos_especificos ?? 0,
      temas: fromValue.temas ?? 0,
    };

    const action = this.editing()
      ? this.competenciaService.actualizar(this.competencia()!.id, payload)
      : this.competenciaService.crear(payload);

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
