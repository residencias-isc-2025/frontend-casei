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
import {
  CapacitacionDocenteData,
  InstitucionData,
} from '@interfaces/index';
import { ToastService, UsersService } from '@services/index';
import { validYearValidator } from '@validators/index';

@Component({
  selector: 'app-update-teaching-training',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-teaching-training.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTeachingTrainingComponent implements OnInit {
  title = input('');
  listaInstituciones = input.required<InstitucionData[]>();
  capacitacionDocente = input.required<CapacitacionDocenteData>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateTeachingTrainingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateTeachingTrainingForm = this.fb.group({
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
    this.updateTeachingTrainingForm.patchValue({
      tipo: this.capacitacionDocente().tipo_capacitacion,
      institucion: this.capacitacionDocente().institucion_pais,
      obtencion: this.capacitacionDocente().anio_obtencion,
      horas: this.capacitacionDocente().horas,
    });
  }

  onSaveData() {
    const { tipo, institucion, obtencion, horas } =
      this.updateTeachingTrainingForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarCapacitacionDocente(
        this.capacitacionDocente().id,

        {
          accessToken: token,
          anio_obtencion: obtencion,
          horas: horas,
          institucion_pais: institucion,
          tipo_capacitacion: tipo,
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
