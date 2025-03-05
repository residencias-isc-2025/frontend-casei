import { Injectable } from '@angular/core';
import { getCurriculumVitaeUseCase } from '@core/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  getCurriculumVitaeFuncition(accessToken: string) {
    return from(getCurriculumVitaeUseCase(accessToken));
  }
}
