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
import { Practica } from '@core/models/practica.model';
import { PracticaService } from '@core/services/practica.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-practica-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './practica-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  practicaService = inject(PracticaService);

  editing = input.required<boolean>();

  title = input('');
  practica = input<Practica>();

  form = this.fb.group({
    siglas: ['', Validators.required],
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.practica()?.descripcion,
      siglas: this.practica()?.siglas,
      nombre: this.practica()?.nombre,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Practica> = {
      descripcion: formValue.descripcion ?? '',
      siglas: formValue.siglas ?? '',
      nombre: formValue.nombre ?? '',
    };

    const action = this.editing()
      ? this.practicaService.actualizar(this.practica()!.id, payload)
      : this.practicaService.crear(payload);

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
