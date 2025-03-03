import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  output,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService, UsersService } from '@presentation/services';

@Component({
  selector: 'app-add-diseno-ingenieril',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-diseno-ingenieril.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDisenoIngenierilComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addDisenoIngenierilForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addDisenoIngenierilForm = this.fb.group({
      organismo: ['', Validators.required],
      periodo: [1, Validators.required],
      experiencia: ['', Validators.required],
    });
  }

  onSaveData() {
    const { organismo, periodo, experiencia } =
      this.addDisenoIngenierilForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addEngineeringDesignFunction({
        accessToken: token,
        nivel_experiencia: experiencia,
        organismo: organismo,
        periodo: periodo
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
