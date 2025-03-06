import { Injectable } from '@angular/core';
import {
  addSchoolUseCase,
  getCountriesListUseCase,
  loadInstitucionesUseCase,
} from '@core/index';
import { InstitucionDto } from '@interfaces/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loadInstituciones(accessToken: string) {
    return from(loadInstitucionesUseCase(accessToken));
  }

  loadCountries() {
    return from(getCountriesListUseCase());
  }

  addSchool(institucionDto: InstitucionDto) {
    return from(addSchoolUseCase(institucionDto));
  }
}
