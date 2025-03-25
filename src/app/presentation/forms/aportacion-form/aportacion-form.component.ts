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
import { Aportacion } from '@core/models/aportacion.model';
import { AportacionService } from '@core/services/aportacion.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-aportacion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aportacion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AportacionFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  aportacionService = inject(AportacionService);

  editing = input.required<boolean>();

  title = input('');
  aportacion = input<Aportacion>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.aportacion()?.descripcion,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Aportacion> = {
      descripcion: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.aportacionService.actualizar(this.aportacion()!.id, payload)
      : this.aportacionService.crear(payload);

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
