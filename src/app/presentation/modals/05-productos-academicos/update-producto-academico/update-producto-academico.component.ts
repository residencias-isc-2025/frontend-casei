import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductosAcademicosResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-update-producto-academico',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-producto-academico.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateProductoAcademicoComponent implements OnInit {
  title = input('');
  productoAcademico = input.required<ProductosAcademicosResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateProductoAcademicoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateProductoAcademicoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateProductoAcademicoForm.patchValue({
      descripcion: this.productoAcademico().descripcion_producto_academico,
    });
  }

  onSaveData() {
    const { descripcion } = this.updateProductoAcademicoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .updateAcademicProductFunction(this.productoAcademico().id, {
        accessToken: token,
        descripcion,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.toastService.showSuccess(res.mensaje!, 'Éxito');
            this.onSave.emit();
          } else {
            this.toastService.showWarning(res.mensaje!, 'Malas noticias');
          }
        },
      });
  }
}
