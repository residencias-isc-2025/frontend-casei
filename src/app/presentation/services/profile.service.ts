import { Injectable } from '@angular/core';
import {
  loadAcademicManagmentUseCase,
  loadAcademicProductsUseCase,
  loadAcademicTrainingUseCase,
  loadDisciplinaryUpdateUseCase,
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
}
