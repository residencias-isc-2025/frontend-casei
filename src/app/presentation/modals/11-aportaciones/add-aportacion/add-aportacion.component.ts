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
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-add-aportacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-aportacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAportacionComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addAportacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addAportacionForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { descripcion } = this.addAportacionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addAportacionesFunction({
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
