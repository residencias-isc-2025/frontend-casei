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
import { CustomDatepickerComponent } from '@presentation/components/custom-datepicker/custom-datepicker.component';
import { ToastService, UsersService } from '@services/index';

@Component({
  selector: 'app-add-experiencia-profesional',
  imports: [CommonModule, ReactiveFormsModule, CustomDatepickerComponent],
  templateUrl: './add-experiencia-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExperienciaProfesionalComponent implements OnInit {
  title = input('');

  onCancel = output();
  onSave = output();

  public toastService = inject(ToastService);
  public usersService = inject(UsersService);

  addExperienciaProfesionalForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addExperienciaProfesionalForm = this.fb.group({
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
    const today = new Date().toISOString().split('T')[0];

    this.addExperienciaProfesionalForm.patchValue({
      gestion_i: today,
      gestion_f: today,
    });
  }

  onStartDateSelected(date: string) {
    this.addExperienciaProfesionalForm.get('gestion_i')?.setValue(date);
  }

  onEndDateSelected(date: string) {
    this.addExperienciaProfesionalForm.get('gestion_f')?.setValue(date);
  }

  onSaveData() {
    const { puesto, empresa, gestion_i, gestion_f } =
      this.addExperienciaProfesionalForm.value;

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService
      .agregarExperienciaProfesional({
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
