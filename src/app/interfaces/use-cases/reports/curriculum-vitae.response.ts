import { ActualizacionDisciplinarResponse } from '../actualizacion-disciplinar.response';
import { AportacionesResponse } from '../aportaciones.response';
import { CapacitacionDocenteResponse } from '../capacitacion-docente.response';
import { DisenoIngenierilResponse } from '../diseno-ingenieril.response';
import { ExperienciaProfesionalResponse } from '../experiencia-profesional.response';
import { FormacionAcademicaData } from '../formacion-academica.response';
import { GestionAcademicaResponse } from '../gestion-academica.response';
import { LogrosPrefesionalesResponse } from '../logros-profesionales.response';
import { ParticipacionResponse } from '../participacion.response';
import { PremiosResponse } from '../premios.response';
import { ProductosAcademicosResponse } from '../productos-academicos.response';
import { UserResponse } from '../user.response';

export interface CurriculumVitaeReponse {
  usuario: UserResponse;
  formacion_academica: FormacionAcademicaData[];
  capacitacion_docente: CapacitacionDocenteResponse[];
  actualizacion_disciplinaria: ActualizacionDisciplinarResponse[];
  gestion_academica: GestionAcademicaResponse[];
  productos_academicos_relevantes: ProductosAcademicosResponse[];
  experiencia_no_academica: ExperienciaProfesionalResponse[];
  experiencia_diseno_ingenieril: DisenoIngenierilResponse[];
  logros_profesionales: LogrosPrefesionalesResponse[];
  participacion: ParticipacionResponse[];
  premios: PremiosResponse[];
  aportaciones: AportacionesResponse[];
}
