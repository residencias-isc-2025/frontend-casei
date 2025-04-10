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
import { ListaCotejo } from '@core/models/lista-cotejo.model';
import { ListaCotejoService } from '@core/services/lista-cotejo.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-lista-cotejo-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './lista-cotejo-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaCotejoFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  listaCotejoService = inject(ListaCotejoService);

  title = input('');
  editing = input.required<boolean>();
  listaCotejo = input<ListaCotejo>();

  selectedFile = signal<File | null>(null);

  form = this.fb.group({
    nombre: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;
    this.form.patchValue({
      nombre: this.listaCotejo()?.nombre,
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile.set(file);
  }

  onSubmit() {
    if (this.form.invalid) return;
    if (!this.editing && this.selectedFile() === null) {
      this.toastService.showWarning('El archivo es obligatorio', 'Atención');
      return;
    }

    const file = this.selectedFile();
    const formData = new FormData();
    const { nombre } = this.form.value;

    formData.append('nombre', nombre ?? '');
    if (file !== null) formData.append('actividad', file);

    const action = this.editing()
      ? this.listaCotejoService.actualizarArchivo(
          this.listaCotejo()!.id,
          formData
        )
      : this.listaCotejoService.cargarArchivo(formData);

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
