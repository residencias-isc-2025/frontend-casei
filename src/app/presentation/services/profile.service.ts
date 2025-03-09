import { Injectable } from '@angular/core';
import {
  obtenerListaGestionAcademicaUseCase,
  obtenerListaProductoAcademicoUseCase,
  obtenerListaFormacionAcademicaUseCase,
  obtenerListaPremioUseCase,
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
  loadFormacionAcademicaFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaFormacionAcademicaUseCase(accessToken, page, pageSize));
  }

  loadCapacitacionDocenteFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadTeachingTrainingUseCase(accessToken, page, pageSize));
  }

  loadActualizacionDisciplinarFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadDisciplinaryUpdateUseCase(accessToken, page, pageSize));
  }

  loadGestionAcademicaFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaGestionAcademicaUseCase(accessToken, page, pageSize));
  }

  loadProductosAcademicosFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaProductoAcademicoUseCase(accessToken, page, pageSize));
  }

  loadExperienciaProfesionalFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadProfessionalExperienceUseCase(accessToken, page, pageSize));
  }

  loadDisenoIngenierilFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadEngineeringDesignUseCase(accessToken, page, pageSize));
  }

  loadLogrosProfesionalesFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      loadProfessionalAchievementsUseCase(accessToken, page, pageSize)
    );
  }

  loadParticipacionesFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadParticipationUseCase(accessToken, page, pageSize));
  }

  loadPremiosFunction(accessToken: string, page: number, pageSize: number = 10) {
    return from(obtenerListaPremioUseCase(accessToken, page, pageSize));
  }

  loadAportacionesFunction(accessToken: string, page: number, pageSize: number = 10) {
    return from(loadContributionsUseCase(accessToken, page, pageSize));
  }
}
