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
import { ExperienciaProfesionalResponse } from '@interfaces/index';
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-update-experiencia-profesional',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './update-experiencia-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateExperienciaProfesionalComponent implements OnInit {
  title = input('');
  experienciaProfesional = input.required<ExperienciaProfesionalResponse>();

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  updateExperienciaProfesionalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.updateExperienciaProfesionalForm = this.fb.group({
      puesto: ['', Validators.required],
      empresa: ['', Validators.required],
      gestion_i: ['', Validators.required],
      gestion_f: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateExperienciaProfesionalForm.patchValue({
      puesto: this.experienciaProfesional().actividad_puesto,
      empresa: this.experienciaProfesional().organizacion_empresa,
      gestion_i: this.experienciaProfesional().d_mes_anio,
      gestion_f: this.experienciaProfesional().a_mes_anio,
    });
  }

  onStartDateSelected(date: string) {
    this.updateExperienciaProfesionalForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.updateExperienciaProfesionalForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { puesto, empresa, gestion_i, gestion_f } =
      this.updateExperienciaProfesionalForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .actualizarExperienciaProfesional(this.experienciaProfesional().id, {
        accessToken: token,
        a_mes_anio: gestion_f,
        d_mes_anio: gestion_i,
        organizacion_empresa: empresa,
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
