import { Injectable } from '@angular/core';
import {
  loadAcademicManagmentUseCase,
  loadAcademicProductsUseCase,
  loadAcademicTrainingUseCase,
  loadAwardsUseCase,
  loadDisciplinaryUpdateUseCase,
  loadEngineeringDesignUseCase,
  loadParticipationUseCase,
  loadProfessionalAchievementsUseCase,
  loadProfessionalExperienceUseCase,
  loadTeachingTrainingUseCase,
} from '@core/index';

import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  loadFormacionAcademica(accessToken: string) {
    return from(loadAcademicTrainingUseCase(accessToken));
  }

  loadCapacitacionDocente(accessToken: string) {
    return from(loadTeachingTrainingUseCase(accessToken));
  }

  loadActualizacionDisciplinar(accessToken: string) {
    return from(loadDisciplinaryUpdateUseCase(accessToken));
  }

  loadGestionAcademica(accessToken: string) {
    return from(loadAcademicManagmentUseCase(accessToken));
  }

  loadProductosAcademicos(accessToken: string) {
    return from(loadAcademicProductsUseCase(accessToken));
  }

  loadExperienciaProfesional(accessToken: string) {
    return from(loadProfessionalExperienceUseCase(accessToken));
  }

  loadDisenoIngenieril(accessToken: string) {
    return from(loadEngineeringDesignUseCase(accessToken));
  }

  loadLogrosProfesionales(accessToken: string) {
    return from(loadProfessionalAchievementsUseCase(accessToken));
  }

  loadParticipaciones(accessToken: string) {
    return from(loadParticipationUseCase(accessToken));
  }

  loadPremios(accessToken: string) {
    return from(loadAwardsUseCase(accessToken));
  }
}
