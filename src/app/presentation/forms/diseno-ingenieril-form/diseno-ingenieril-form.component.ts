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
import { DisenoIngenieril } from '@core/models/diseno-ingenieril.model';
import { DisenoIngenierilService } from '@core/services/diseno-ingenieril.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-diseno-ingenieril-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diseno-ingenieril-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisenoIngenierilFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  disenoIngenierilService = inject(DisenoIngenierilService);

  editing = input.required<boolean>();

  title = input('');
  disenoIngenieril = input<DisenoIngenieril>();

  form = this.fb.group({
    organismo: ['', Validators.required],
    periodo: [1, Validators.required],
    experiencia: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      organismo: this.disenoIngenieril()?.organismo,
      periodo: this.disenoIngenieril()?.periodo,
      experiencia: this.disenoIngenieril()?.nivel_experiencia,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<DisenoIngenieril> = {
      nivel_experiencia: formValue.experiencia ?? '',
      organismo: formValue.organismo ?? '',
      periodo: formValue.periodo ?? 0,
    };

    const action = this.editing()
      ? this.disenoIngenierilService.actualizar(
          this.disenoIngenieril()!.id,
          payload
        )
      : this.disenoIngenierilService.crear(payload);

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
