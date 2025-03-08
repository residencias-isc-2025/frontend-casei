import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastService, CommonService } from '@presentation/services';

@Component({
  selector: 'app-add-area-adscripcion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-area-adscripcion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddAreaAdscripcionComponent {
  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  addAdscripcionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addAdscripcionForm = this.fb.group({
      nombre: ['', Validators.required],
      siglas: ['', Validators.required],
    });
  }

  onCreateAdscripcion() {
    const { nombre, siglas } = this.addAdscripcionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .agrearAreaAdscripcion({
        accessToken: token,
        nombre,
        siglas,
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
