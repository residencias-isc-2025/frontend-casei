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
  GestionAcademicaResponse,
  InstitucionResponse,
} from '@interfaces/index';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-update-gestion-academica',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './update-gestion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateGestionAcademicaComponent implements OnInit {
  title = input('');
  listaInstituciones = input.required<InstitucionResponse[]>();
  gestionAcademica = input.required<GestionAcademicaResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateGestionAcademicaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateGestionAcademicaForm = this.fb.group({
      puesto: ['', Validators.required],
      institucion: ['', Validators.required],
      gestion_i: ['', Validators.required],
      gestion_f: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateGestionAcademicaForm.patchValue({
      puesto: this.gestionAcademica().actividad_puesto,
      institucion: this.gestionAcademica().institucion_pais,
      gestion_i: this.gestionAcademica().d_mes_anio,
      gestion_f: this.gestionAcademica().a_mes_anio,
    });
  }

  onStartDateSelected(date: string) {
    this.updateGestionAcademicaForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.updateGestionAcademicaForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { puesto, institucion, gestion_i, gestion_f } =
      this.updateGestionAcademicaForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarGestionAcademica(this.gestionAcademica().id, {
        accessToken: token,
        a_mes_anio: gestion_f,
        d_mes_anio: gestion_i,
        institucion_pais: institucion,
        actividad_puesto: puesto,
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
