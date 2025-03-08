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
  selector: 'app-add-actualizacion-disciplinar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-actualizacion-disciplinar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddActualizacionDisciplinarComponent {
  title = input('');
  listaInstituciones = input.required<InstitucionData[]>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addActualizacionDisciplinarForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addActualizacionDisciplinarForm = this.fb.group({
      tipo: ['', Validators.required],
      institucion: ['', Validators.required],
      obtencion: ['', [Validators.required, validYearValidator]],
      horas: [''],
    });
  }

  onSaveData() {
    const { tipo, institucion, obtencion, horas } =
      this.addActualizacionDisciplinarForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .agregarActualizacionDisciplinar({
        accessToken: token,
        anio_obtencion: obtencion,
        horas: horas,
        institucion_pais: institucion,
        tipo_actualizacion: tipo,
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
