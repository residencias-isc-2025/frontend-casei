import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-add-premios',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-premios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPremiosComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addPremioForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addPremioForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { descripcion } = this.addPremioForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .agregarPremio({
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
