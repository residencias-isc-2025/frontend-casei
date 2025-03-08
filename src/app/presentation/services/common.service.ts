import { Injectable } from '@angular/core';
import {
  addSchoolUseCase,
  disableSchoolUseCase,
  enableSchoolUseCase,
  getCountriesListUseCase,
  loadInstitucionesUseCase,
  updateSchoolUseCase,
} from '@core/index';
import { InstitucionDto } from '@interfaces/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  loadInstituciones(accessToken: string, page: number, pageSize: number = 10) {
    return from(loadInstitucionesUseCase(accessToken, page, pageSize));
  }

  loadCountries() {
    return from(getCountriesListUseCase());
  }

  addSchool(institucionDto: InstitucionDto) {
    return from(addSchoolUseCase(institucionDto));
  }

  updateSchool(idInstitucion: number, institucionDto: InstitucionDto) {
    return from(updateSchoolUseCase(idInstitucion, institucionDto));
  }

  enableSchool(idInstitucion: number, accessToken: string) {
    return from(enableSchoolUseCase(idInstitucion, accessToken));
  }

  disableSchool(idInstitucion: number, accessToken: string) {
    return from(disableSchoolUseCase(idInstitucion, accessToken));
  }
}
