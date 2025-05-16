import { Bibliografia } from './bibliografia.model';
import { Competencia } from './competencia.model';
import { CriterioDesempenio } from './criterio-desempenio.model';
import { Materia } from './materia.model';
import { ObjetivoEspecifico } from './objetivo-especifico.model';
import { Tema } from './tema.model';

export interface ProgramaAsignatura {
  materia: Materia;
  competencias: Competencia[];
  objetivos_especificos: ObjetivoEspecifico[];
  temas: Tema[];
}
