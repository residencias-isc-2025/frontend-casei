import { Injectable } from '@angular/core';
import {
  loadAcademicTrainingUseCase,
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
}
