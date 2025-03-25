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
import { Premio } from '@core/models/premio.model';
import { PremioService } from '@core/services/premio.service';
import { ToastService } from '@presentation/services';

@Component({
  selector: 'app-premio-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './premio-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PremioFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  premioService = inject(PremioService);

  editing = input.required<boolean>();

  title = input('');
  premio = input<Premio>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.premio()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Premio> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.premioService.actualizar(this.premio()!.id, payload)
      : this.premioService.crear(payload);

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
