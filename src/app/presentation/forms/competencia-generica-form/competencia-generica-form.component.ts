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
import { CompetenciaGenerica } from '@core/models/competencia-generica.model';
import { CompetenciaGenericaService } from '@core/services/competencia-generica.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-competencia-generica-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './competencia-generica-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompetenciaGenericaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  competenciaGenericaService = inject(CompetenciaGenericaService);

  editing = input.required<boolean>();

  title = input('');
  competenciaGenerica = input<CompetenciaGenerica>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.competenciaGenerica()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<CompetenciaGenerica> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.competenciaGenericaService.actualizar(
          this.competenciaGenerica()!.id,
          payload
        )
      : this.competenciaGenericaService.crear(payload);

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
