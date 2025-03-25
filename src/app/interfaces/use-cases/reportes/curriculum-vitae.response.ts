import { ActualizacionDisciplinar } from '@core/models/actualizacion-disciplinar.model';
import { Aportacion } from '@core/models/aportacion.model';
import { CapacitacionDocente } from '@core/models/capacitacion-docente.model';
import { FormacionAcademica } from '@core/models/formacion-academica.model';
import { User } from '@core/models/user.model';
import { DisenoIngenieril } from '@core/models/diseno-ingenieril.model';

import { ExperienciaProfesionalData } from '../experiencia-profesional.response';
import { GestionAcademicaData } from '../gestion-academica.response';
import { LogroProfesionalData } from '../logros-profesionales.response';
import { ParticipacionData } from '../participacion.response';
import { PremioData } from '../premios.response';
import { ProductoAcademicoData } from '../productos-academicos.response';

export interface CurriculumVitaeResponse {
  usuario: User;
  formacion_academica: FormacionAcademica[];
  capacitacion_docente: CapacitacionDocente[];
  actualizacion_disciplinaria: ActualizacionDisciplinar[];
  gestion_academica: GestionAcademicaData[];
  productos_academicos_relevantes: ProductoAcademicoData[];
  experiencia_no_academica: ExperienciaProfesionalData[];
  experiencia_diseno_ingenieril: DisenoIngenieril[];
  logros_profesionales: LogroProfesionalData[];
  participacion: ParticipacionData[];
  premios: PremioData[];
  aportaciones: Aportacion[];
}
