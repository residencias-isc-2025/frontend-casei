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
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-add-objetivo-especifico',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-objetivos-especificos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddObjetivoEspecificoComponent {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  addObjetivoForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addObjetivoForm = this.fb.group({
      descripcion: ['', Validators.required],
    });
  }

  onSaveData() {
    const { descripcion } = this.addObjetivoForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .agregarObjetivoEspecifico({
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
