import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-add-logro-profesional',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-logro-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddLogroProfesionalComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addLogroProfesionalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addLogroProfesionalForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { descripcion } = this.addLogroProfesionalForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addProfessionalAchievementsFunction({
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
