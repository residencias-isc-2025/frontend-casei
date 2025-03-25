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
import { ProductoAcademico } from '@core/models/productos-academicos.model';
import { ProductoAcademicoService } from '@core/services/producto-academico.service';
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-producto-academico-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './producto-academico-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductoAcademicoFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  productoAcademicoService = inject(ProductoAcademicoService);

  editing = input.required<boolean>();

  title = input('');
  productoAcademico = input<ProductoAcademico>();

  form = this.fb.group({
    descripcion: ['', Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;

    this.form.patchValue({
      descripcion: this.productoAcademico()?.descripcion_producto_academico,
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const payload: Partial<ProductoAcademico> = {
      descripcion_producto_academico: formValue.descripcion ?? '',
    };

    const action = this.editing()
      ? this.productoAcademicoService.actualizar(
          this.productoAcademico()!.id,
          payload
        )
      : this.productoAcademicoService.crear(payload);

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
