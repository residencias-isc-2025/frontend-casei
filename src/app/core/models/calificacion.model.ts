import { Actividad } from './actividad.model';
import { Alumno } from './alumno.model';
import { Clase } from './clase.model';

export interface Calificacion {
  id: number;
  alumno: Alumno;
  actividad: Actividad;
  clase: Clase;
  calificacion: number;
}
