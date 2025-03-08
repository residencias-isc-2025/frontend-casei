import { Injectable } from '@angular/core';
import {
  addAdscripcionUseCase,
  addSchoolUseCase,
  disableAdscripcionUseCase,
  disableSchoolUseCase,
  enableAdscripcionUseCase,
  enableSchoolUseCase,
  getCountriesListUseCase,
  loadAdscripcionesUseCase,
  loadInstitucionesUseCase,
  updateAdscripcionUseCase,
  updateSchoolUseCase,
} from '@core/index';
import { AreaAdscripcionDto, InstitucionDto } from '@interfaces/index';
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

  agrearAreaAdscripcion(areaAdscripcionDto: AreaAdscripcionDto) {
    return from(addAdscripcionUseCase(areaAdscripcionDto));
  }

  actualizarInstitucion(idInstitucion: number, institucionDto: InstitucionDto) {
    return from(updateSchoolUseCase(idInstitucion, institucionDto));
  }

  actualizarAreaAdscripcion(
    idAdscripcion: number,
    areaAdscripcionDto: AreaAdscripcionDto
  ) {
    return from(updateAdscripcionUseCase(idAdscripcion, areaAdscripcionDto));
  }

  activarInstitucion(idInstitucion: number, accessToken: string) {
    return from(enableSchoolUseCase(idInstitucion, accessToken));
  }

  activarAreaAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(enableAdscripcionUseCase(idAdscripcion, accessToken));
  }

  desactivarInstitucion(idInstitucion: number, accessToken: string) {
    return from(disableSchoolUseCase(idInstitucion, accessToken));
  }

  desactivarAreaAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(disableAdscripcionUseCase(idAdscripcion, accessToken));
  }
}
