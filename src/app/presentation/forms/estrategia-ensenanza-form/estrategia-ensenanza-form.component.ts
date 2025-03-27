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
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { EstrategiaEnsenanzaService } from '@core/services/estrategia-ensenanza.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-estrategio-ensenanza-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './estrategia-ensenanza-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstrategioEnsenanzaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  estrategiaEnsenanzaService = inject(EstrategiaEnsenanzaService);

  editing = input.required<boolean>();

  title = input('');
  estrategiaEnsenanza = input<EstrategiaEnsenanza>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.estrategiaEnsenanza()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<EstrategiaEnsenanza> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.estrategiaEnsenanzaService.actualizar(
          this.estrategiaEnsenanza()!.id,
          payload
        )
      : this.estrategiaEnsenanzaService.crear(payload);

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
