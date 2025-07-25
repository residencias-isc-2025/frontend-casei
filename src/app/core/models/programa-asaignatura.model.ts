import { AtributoEgreso } from './atributo-egreso.model';
import { Bibliografia } from './bibliografia.model';
import { Competencia } from './competencia.model';
import { EstrategiaEnsenanza } from './estrategia-ensenanza.model';
import { EstrategiaEvaluacion } from './estrategia-evaluacion.model';
import { Materia } from './materia.model';
import { ObjetivoEspecifico } from './objetivo-especifico.model';
import { Practica } from './practica.model';
import { Tema } from './tema.model';
import { User } from './user.model';
import { Calificacion } from './calificacion.model';
import { Clase } from './clase.model';

export interface ProgramaAsignatura {
  materia: Materia;
  competencias: Competencia[];
  objetivos_especificos: ObjetivoEspecifico[];
  temas: Tema[];
  atributos_egreso: AtributoEgreso[];
  estrategias_ensenanza: EstrategiaEnsenanza[];
  estrategias_evaluacion: EstrategiaEvaluacion[];
  practicas: Practica[];
  bibliografias: Bibliografia[];
  total_clases_periodo_actual: number;
  docentes_periodo_actual: User[];
  clases: Clase[];
  calificacion?: string;
  porcentaje_aprobacion_superado?: string;
  porcentaje_reprobacion?: string;
}
