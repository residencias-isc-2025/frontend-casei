import { Injectable } from '@angular/core';
import {
  loadAcademicManagmentUseCase,
  loadAcademicProductsUseCase,
  loadAcademicTrainingUseCase,
  loadAwardsUseCase,
  loadContributionsUseCase,
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
  loadFormacionAcademica(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadAcademicTrainingUseCase(accessToken, page, pageSize));
  }

  loadCapacitacionDocente(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadTeachingTrainingUseCase(accessToken, page, pageSize));
  }

  loadActualizacionDisciplinar(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadDisciplinaryUpdateUseCase(accessToken, page, pageSize));
  }

  loadGestionAcademica(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadAcademicManagmentUseCase(accessToken, page, pageSize));
  }

  loadProductosAcademicos(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadAcademicProductsUseCase(accessToken, page, pageSize));
  }

  loadExperienciaProfesional(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadProfessionalExperienceUseCase(accessToken, page, pageSize));
  }

  loadDisenoIngenieril(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadEngineeringDesignUseCase(accessToken, page, pageSize));
  }

  loadLogrosProfesionales(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      loadProfessionalAchievementsUseCase(accessToken, page, pageSize)
    );
  }

  loadParticipaciones(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadParticipationUseCase(accessToken, page, pageSize));
  }

  loadPremios(accessToken: string, page: number, pageSize: number = 10) {
    return from(loadAwardsUseCase(accessToken, page, pageSize));
  }

  loadAportaciones(accessToken: string, page: number, pageSize: number = 10) {
    return from(loadContributionsUseCase(accessToken, page, pageSize));
  }
}
