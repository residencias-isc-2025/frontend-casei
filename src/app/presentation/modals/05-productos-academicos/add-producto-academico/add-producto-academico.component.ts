import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-add-producto-academico',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-producto-academico.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductoAcademicoComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addProductoAcademicoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addProductoAcademicoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { descripcion } = this.addProductoAcademicoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addAcademicProductFunction({
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
