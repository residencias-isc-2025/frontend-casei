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
import { UserDataResponse } from '@interfaces/index';

import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-update-teacher-name',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-teacher-name.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTeacherNameComponent implements OnInit {
  onCancel = output();
  onSave = output();

  userProfile = input.required<UserDataResponse>();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateTeacherNameForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateTeacherNameForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_p: ['', Validators.required],
      apellido_m: ['', Validators.required],
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
    });
  }

  onSaveData() {
    const { nombre, apellido_p, apellido_m } = this.updateTeacherNameForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .updateUserData(token, {
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
