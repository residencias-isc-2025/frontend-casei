import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnoService } from '@core/services/alumno.service';
import { ToastService } from '@core/services/toast.service';
import { Alumno } from '@core/models/alumno.model';
import { Carrera } from '@core/models/carrera.model';

@Component({
  selector: 'app-alumno-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alumno-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlumnoFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  fb = inject(FormBuilder);
  toastService = inject(ToastService);
  alumnoService = inject(AlumnoService);

  alumno = input<Alumno>();
  title = input<string>('');
  carreras = input.required<Carrera[]>();
  editing = input.required<boolean>();

  form = this.fb.group({
    matricula: ['', Validators.required],
    nombre: ['', Validators.required],
    apellido_paterno: ['', Validators.required],
    apellido_materno: ['', Validators.required],
    carrera: [0, Validators.required],
  });

  ngOnInit(): void {
    if (!this.editing()) return;
    this.form.patchValue(this.alumno()!);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload: Partial<Alumno> = {
      matricula: formValue.matricula ?? '',
      nombre: formValue.nombre ?? '',
      apellido_paterno: formValue.apellido_paterno ?? '',
      apellido_materno: formValue.apellido_materno ?? '',
      carrera: formValue.carrera ?? 0,
    };

    const action = this.editing()
      ? this.alumnoService.actualizar(this.alumno()!.id, payload)
      : this.alumnoService.crear(payload);

    action.subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
    });
  }
}
