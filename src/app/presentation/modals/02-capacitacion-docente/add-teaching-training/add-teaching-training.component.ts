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
import { InstitucionData } from '@interfaces/index';
import { ToastService, UsersService } from '@services/index';
import { validYearValidator } from '@validators/index';

@Component({
  selector: 'app-add-teaching-training',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-teaching-training.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddTeachingTrainingComponent {
  title = input('');
  listaInstituciones = input.required<InstitucionData[]>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addTeachingTrainingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addTeachingTrainingForm = this.fb.group({
      tipo: ['', Validators.required],
      institucion: ['', Validators.required],
      obtencion: ['', [Validators.required, validYearValidator]],
      horas: [''],
    });
  }

  onSaveData() {
    const { tipo, institucion, obtencion, horas } =
      this.addTeachingTrainingForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .agregarCapacitacionDocente({
        accessToken: token,
        anio_obtencion: obtencion,
        horas: horas,
        institucion_pais: institucion,
        tipo_capacitacion: tipo,
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
