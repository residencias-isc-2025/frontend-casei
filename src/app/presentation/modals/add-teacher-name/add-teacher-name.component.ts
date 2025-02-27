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
  selector: 'app-add-teacher-name',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-teacher-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTeacherNameComponent {
  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addTeacherNameForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addTeacherNameForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_p: ['', Validators.required],
      apellido_m: ['', Validators.required],
    });
  }

  onSaveData() {
    const { nombre, apellido_p, apellido_m } = this.addTeacherNameForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addUserData(token, {
        id: 0,
        nombre,
        apellido_paterno: apellido_p,
        apellido_materno: apellido_m,
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
