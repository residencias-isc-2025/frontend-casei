import { Injectable } from '@angular/core';
import { loadInstitucionesUseCase } from '@core/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loadInstituciones(accessToken: string) {
    return from(loadInstitucionesUseCase(accessToken));
  }
}
