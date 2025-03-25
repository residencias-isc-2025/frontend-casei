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
import { Adscripcion } from '@core/models/adscripcion.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { ToastService } from '@presentation/services';

@Component({
  selector: 'app-adscripcion-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './adscripcion-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdscripcionFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  adscripcionService = inject(AdscripcionService);

  editing = input.required<boolean>();

  adscripcion = input<Adscripcion>();

  form = this.fb.group({
    nombre: ['', Validators.required],
    siglas: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      nombre: this.adscripcion()?.nombre,
      siglas: this.adscripcion()?.siglas,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<Adscripcion> = {
      nombre: formValue.nombre ?? '',
      siglas: formValue.siglas ?? '',
    };

    const action = this.editing()
      ? this.adscripcionService.actualizar(
          this.adscripcion()!.id,
          payload
        )
      : this.adscripcionService.crear(payload);

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
