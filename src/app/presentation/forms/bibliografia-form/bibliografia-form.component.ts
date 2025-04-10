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
import { Bibliografia } from '@core/models/bibliografia.model';
import { BibliografiaService } from '@core/services/bibliografia.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-bibliografia-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bibliografia-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BibliografiaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  bibliografiaService = inject(BibliografiaService);

  editing = input.required<boolean>();
  title = input('');
  bibliografia = input<Bibliografia>();

  form = this.fb.group({
    isssn: ['', Validators.required],
    nombre: ['', Validators.required],
    ieee: ['', Validators.required],
    anio: [0, Validators.required],
    autor: ['', Validators.required],
    tipo: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      isssn: this.bibliografia()?.isssn,
      nombre: this.bibliografia()?.nombre,
      ieee: this.bibliografia()?.ieee,
      anio: this.bibliografia()?.anio,
      autor: this.bibliografia()?.autor,
      tipo: this.bibliografia()?.tipo,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    const formValue = this.form.value;

    const payload: Partial<Bibliografia> = {
      isssn: formValue.isssn ?? '',
      nombre: formValue.nombre ?? '',
      ieee: formValue.ieee ?? '',
      anio: formValue.anio ?? 0,
      autor: formValue.autor ?? '',
      tipo: formValue.tipo ?? '',
    };

    const action = this.editing()
      ? this.bibliografiaService.actualizar(this.bibliografia()!.id, payload)
      : this.bibliografiaService.crear(payload);

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
