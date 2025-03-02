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

import { UserResponse } from '@interfaces/index';
import { ToastService, UsersService } from '@services/index';
import { CustomDatepickerComponent } from '@components/custom-datepicker/custom-datepicker.component';

@Component({
  selector: 'app-update-teacher-name',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './update-teacher-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTeacherNameComponent implements OnInit {
  onCancel = output();
  onSave = output();

  userProfile = input.required<UserResponse>();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateTeacherNameForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateTeacherNameForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_p: ['', Validators.required],
      apellido_m: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateTeacherNameForm.patchValue({
      nombre: this.userProfile().nombre,
      apellido_p: this.userProfile().apellido_paterno,
      apellido_m: this.userProfile().apellido_materno,
      fecha_nacimiento: this.userProfile().fecha_nacimiento,
    });
  }

  onDateSelected(date: string) {
    this.updateTeacherNameForm.get('fecha_nacimiento')?.setValue(date);
  }

  onSaveData() {
    const { nombre, apellido_p, apellido_m, fecha_nacimiento} = this.updateTeacherNameForm.value;
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .updateUserData(token, {
        id: this.userProfile().id!,
        nombre,
        apellido_paterno: apellido_p,
        apellido_materno: apellido_m,
        fecha_nacimiento
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
