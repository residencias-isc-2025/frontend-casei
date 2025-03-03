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
import { InstitucionesResponse } from '@interfaces/index';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-add-gestion-academica',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './add-gestion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddGestionAcademicaComponent implements OnInit {
  title = input('');
  listaInstituciones = input.required<InstitucionesResponse[]>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addGestionAcademicaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addGestionAcademicaForm = this.fb.group({
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
    const today = new Date().toISOString().split('T')[0];

    this.addGestionAcademicaForm.patchValue({
      gestion_i: today,
      gestion_f: today,
    });
  }

  onStartDateSelected(date: string) {
    this.addGestionAcademicaForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.addGestionAcademicaForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { puesto, institucion, gestion_i, gestion_f } =
      this.addGestionAcademicaForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .addAcademicManagmentFunction({
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
