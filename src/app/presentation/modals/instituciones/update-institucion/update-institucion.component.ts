import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CountriesResponse, InstitucionData } from '@interfaces/index';
import { CommonService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-update-institucion',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-institucion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateInstitucionComponent implements OnInit {
  school = input.required<InstitucionData>();
  countriesList = input<CountriesResponse[]>([]);

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  updateSchoolForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateSchoolForm = this.fb.group({
      nombre: ['', Validators.required],
      pais: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateSchoolForm.patchValue({
      nombre: this.school().nombre_institucion,
      pais: this.school().pais,
    });
  }

  onUpdateSchool() {
    const { nombre, pais } = this.updateSchoolForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .actualizarInstitucion(this.school().id, {
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
