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
import { AdscripcionData } from '@interfaces/index';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-update-area-adscripcion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-area-adscripcion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAreaAdscripcionComponent implements OnInit {
  onCancel = output();
  onSave = output();

  adscripcion = input.required<AdscripcionData>();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  updateAdscripcionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateAdscripcionForm = this.fb.group({
      nombre: ['', Validators.required],
      siglas: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateAdscripcionForm.patchValue({
      nombre: this.adscripcion().nombre,
      siglas: this.adscripcion().siglas,
    });
  }

  onUpdateAdscripcion() {
    const { nombre, siglas } = this.updateAdscripcionForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .actualizarAreaAdscripcion(this.adscripcion().id, {
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
