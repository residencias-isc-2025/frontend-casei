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
import {
  ActualizacionDisciplinarData,
  InstitucionData,
} from '@interfaces/index';
import { ToastService, UsersService } from '@services/index';
import { validYearValidator } from '@validators/index';

@Component({
  selector: 'app-update-actualizacion-disciplinar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-actualizacion-disciplinar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateActualizacionDisciplinarComponent {
  title = input('');
  listaInstituciones = input.required<InstitucionData[]>();
  actualizacionDisciplinar = input.required<ActualizacionDisciplinarData>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateActualizacionDisciplinarForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateActualizacionDisciplinarForm = this.fb.group({
      tipo: ['', Validators.required],
      institucion: ['', Validators.required],
      obtencion: ['', [Validators.required, validYearValidator]],
      horas: [''],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateActualizacionDisciplinarForm.patchValue({
      tipo: this.actualizacionDisciplinar().tipo_actualizacion,
      institucion: this.actualizacionDisciplinar().institucion_pais,
      obtencion: this.actualizacionDisciplinar().anio_obtencion,
      horas: this.actualizacionDisciplinar().horas,
    });
  }

  onSaveData() {
    const { tipo, institucion, obtencion, horas } =
      this.updateActualizacionDisciplinarForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarActualizacionDisciplinar(
        this.actualizacionDisciplinar().id,

        {
          accessToken: token,
          anio_obtencion: obtencion,
          horas: horas,
          institucion_pais: institucion,
          tipo_actualizacion: tipo,
        }
      )
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
