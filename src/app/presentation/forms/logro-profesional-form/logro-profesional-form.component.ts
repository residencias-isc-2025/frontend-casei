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
import { LogroProfesional } from '@core/models/logro-profesional.model';
import { LogroProfesionalService } from '@core/services/logro-profesional.service';
import { ToastService } from '@presentation/services';

@Component({
  selector: 'app-logro-profesional-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './logro-profesional-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogroProfesionalFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  logroProfesionalService = inject(LogroProfesionalService);

  editing = input.required<boolean>();

  title = input('');
  logroProfesional = input<LogroProfesional>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.logroProfesional()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<LogroProfesional> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.logroProfesionalService.actualizar(
          this.logroProfesional()!.id,
          payload
        )
      : this.logroProfesionalService.crear(payload);

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
