import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actividad } from '@core/models/actividad.model';
import { ActividadService } from '@core/services/actividad.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-actividad-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './actividad-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActividadFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  actividadService = inject(ActividadService);

  descripcionFile = signal<File | null>(null);
  formatoFile = signal<File | null>(null);

  claseId = input.required<number>();

  title = input('');
  editing = input.required<boolean>();
  actividad = input<Actividad>();

  form = this.fb.group({
    titulo: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      titulo: this.actividad()?.titulo,
    });
  }

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

  disableForm() {
    if (this.editing()) return false;

    return !this.descripcionFile() || !this.formatoFile();
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (!this.editing && this.descripcionFile() === null) {
      this.toastService.showWarning(
        'El archivo de descripción es obligatorio',
        'Atención'
      );
      return;
    }

    if (!this.editing && this.formatoFile() === null) {
      this.toastService.showWarning(
        'El archivo de formato es obligatorio',
        'Atención'
      );
      return;
    }

    const fileDescripcion = this.descripcionFile();
    const fileFormato = this.formatoFile();

    const { titulo } = this.form.value;
    const formData = new FormData();

    formData.append('titulo', titulo ?? '');
    formData.append('clase', this.claseId().toString());

    if (fileDescripcion !== null) {
      formData.append('descripcion', fileDescripcion);
    }

    if (fileFormato !== null) {
      formData.append('formato', fileFormato);
    }

    const action = this.editing()
      ? this.actividadService.actualizarActividad(
          this.actividad()!.id,
          formData
        )
      : this.actividadService.cargarArchivo(formData);

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
