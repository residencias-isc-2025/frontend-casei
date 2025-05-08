import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { Alumno } from '@core/models/alumno.model';
import { Carrera } from '@core/models/carrera.model';
import { Clase } from '@core/models/clase.model';
import { Periodo } from '@core/models/periodo.model';

@Component({
  selector: 'app-alumnos-clase-form',
  imports: [],
  templateUrl: './alumnos-clase-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlumnosClaseFormComponent {
  onCancel = output();

  materiaClave = input.required<string>();
  clase = input.required<Clase>();
  carrera = input.required<Carrera>();
  materiaNombre = input.required<string>();
  periodo = input.required<Periodo>();
  alumnos = input.required<Alumno[]>();
}
