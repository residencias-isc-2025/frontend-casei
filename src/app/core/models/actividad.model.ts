import { Alumno } from './alumno.model';

export interface Actividad {
  descripcion: string;
  formato: string;

  // ID de la calificación
  calificaciones?: number[];

  alumno_alto?: Alumno;
  alumno_alto_calificacion?: number;
  alumno_alto_evidencia?: string;

  alumno_promedio?: Alumno;
  alumno_promedio_calificacion?: number;
  alumno_promedio_evidencia?: string;

  alumno_bajo?: Alumno;
  alumno_bajo_calificacion?: number;
  alumno_bajo_evidencia?: string;
}
