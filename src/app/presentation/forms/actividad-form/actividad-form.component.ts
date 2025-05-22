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
import { ActividadService } from '@core/services/actividad.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-actividad-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadFormComponent {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  actividadService = inject(ActividadService);

  descripcionFile = signal<File | null>(null);
  formatoFile = signal<File | null>(null);

  claseId = input.required<number>();

  form = this.fb.group({
    titulo: ['', Validators.required],
  });

  onDescripcionFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.descripcionFile.set(file);
  }

  onFormatoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.formatoFile.set(file);
  }

  onSubmit() {
    if (this.descripcionFile() === null) {
      this.toastService.showWarning(
        'El archivo de descripción es obligatorio',
        'Atención'
      );
      return;
    }

    if (this.formatoFile() === null) {
      this.toastService.showWarning(
        'El archivo de formato es obligatorio',
        'Atención'
      );
      return;
    }

    if (this.form.invalid) return;

    const { titulo } = this.form.value;
    const formData = new FormData();

    formData.append('descripcion', this.descripcionFile()!);
    formData.append('formato', this.formatoFile()!);
    formData.append('titulo', titulo ?? '');
    formData.append('clase', this.claseId().toString());

    this.actividadService.cargarArchivo(formData).subscribe({
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
