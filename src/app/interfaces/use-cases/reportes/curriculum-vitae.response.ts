import { User } from '@core/models/user.model';
import { ActualizacionDisciplinarData } from '../actualizacion-disciplinar.response';
import { AportacionData } from '../aportaciones.response';
import { CapacitacionDocenteData } from '../capacitacion-docente.response';
import { DisenoIngenierilData } from '../diseno-ingenieril.response';
import { ExperienciaProfesionalData } from '../experiencia-profesional.response';
import { GestionAcademicaData } from '../gestion-academica.response';
import { LogroProfesionalData } from '../logros-profesionales.response';
import { ParticipacionData } from '../participacion.response';
import { PremioData } from '../premios.response';
import { ProductoAcademicoData } from '../productos-academicos.response';
import { FormacionAcademica } from '@core/models/formacion-academica.model';

export interface CurriculumVitaeResponse {
  usuario: User;
  formacion_academica: FormacionAcademica[];

  capacitacion_docente: CapacitacionDocenteData[];
  actualizacion_disciplinaria: ActualizacionDisciplinarData[];
  gestion_academica: GestionAcademicaData[];
  productos_academicos_relevantes: ProductoAcademicoData[];
  experiencia_no_academica: ExperienciaProfesionalData[];
  experiencia_diseno_ingenieril: DisenoIngenierilData[];
  logros_profesionales: LogroProfesionalData[];
  participacion: ParticipacionData[];
  premios: PremioData[];
  aportaciones: AportacionData[];
}
