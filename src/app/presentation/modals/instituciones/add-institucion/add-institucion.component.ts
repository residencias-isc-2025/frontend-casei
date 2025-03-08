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
import { CountriesResponse } from '@interfaces/index';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-add-institucion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-institucion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddInstitucionComponent {
  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  countriesList = input<CountriesResponse[]>([]);

  addSchoolForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addSchoolForm = this.fb.group({
      nombre: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  onCreateSchool() {
    const { nombre, pais } = this.addSchoolForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .agregarInstitucion({
        accessToken: token,
        nombre_institucion: nombre,
        pais,
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
