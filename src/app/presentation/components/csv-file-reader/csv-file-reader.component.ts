import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { AlumnoService } from '@core/services/alumno.service';
import { InstitucionService } from '@core/services/institucion.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-csv-file-reader',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './csv-file-reader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CsvFileReaderComponent {
  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);

  title = input('Título');
  templateName = input.required<string>();
  service = input.required<
    UserService | AdscripcionService | InstitucionService | AlumnoService
  >();

  onSuccess = output();
  onCancel = output();

  form = this.fb.group({});

  selectedFile = signal<File | null>(null);

  descargarTemplate(): void {
    const url = `/templates/${this.templateName()}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = this.templateName();
    a.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile.set(file);
  }

  onSubmit() {
    if (!this.selectedFile()) {
      this.toastService.showWarning('Debe seleccionar un archivo.', 'Atención');
      return;
    }

    const formData = new FormData();

    formData.append('archivo_csv', this.selectedFile()!);

    this.toastService.showInfo('Por favor espere...', 'Leyendo archivo');

    this.service()
      .leerArchivoCsv(formData)
      .subscribe({
        error: (response) => {
          this.toastService.showError(response.mensaje!, 'Malas noticias');
        },
        next: (response) => {
          this.toastService.showSuccess(response.mensaje!, 'Éxito');
          this.onSuccess.emit();
        },
      });
  }
}
