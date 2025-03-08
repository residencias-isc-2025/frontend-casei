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
  selector: 'app-add-participacion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-participacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddParticipacionComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addParticipacionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addParticipacionForm = this.fb.group({
      organismo: ['', Validators.required],
      periodo: [1, Validators.required],
      participacion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { organismo, periodo, participacion } =
      this.addParticipacionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .agregarParticipacion({
        accessToken: token,
        nivel_p: participacion,
        organismo: organismo,
        periodo: periodo,
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
