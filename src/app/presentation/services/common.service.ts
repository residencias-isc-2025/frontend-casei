import { Injectable } from '@angular/core';
import {
  addSchoolUseCase,
  disableSchoolUseCase,
  enableSchoolUseCase,
  getCountriesListUseCase,
  loadAdscripcionesUseCase,
  loadInstitucionesUseCase,
  updateSchoolUseCase,
} from '@core/index';
import { InstitucionDto } from '@interfaces/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getInstitucionesList(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadInstitucionesUseCase(accessToken, page, pageSize));
  }

  getPaisesList() {
    return from(getCountriesListUseCase());
  }

  getAdscripcionesList(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(loadAdscripcionesUseCase(accessToken, page, pageSize));
  }

  agregarInstitucion(institucionDto: InstitucionDto) {
    return from(addSchoolUseCase(institucionDto));
  }

  actualizarInstitucion(idInstitucion: number, institucionDto: InstitucionDto) {
    return from(updateSchoolUseCase(idInstitucion, institucionDto));
  }

  activarInstitucion(idInstitucion: number, accessToken: string) {
    return from(enableSchoolUseCase(idInstitucion, accessToken));
  }

  desactivarInstitucion(idInstitucion: number, accessToken: string) {
    return from(disableSchoolUseCase(idInstitucion, accessToken));
  }
}
