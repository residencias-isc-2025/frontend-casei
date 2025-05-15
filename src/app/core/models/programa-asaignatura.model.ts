import { Bibliografia } from './bibliografia.model';
import { Competencia } from './competencia.model';
import { CriterioDesempenio } from './criterio-desempenio.model';
import { Materia } from './materia.model';

export interface ProgramaAsignatura {
  materia?: Materia;
  bibliografias?: Bibliografia[];
  competencias?: Competencia[];
  criterios_desempeno?: CriterioDesempenio[];
}
