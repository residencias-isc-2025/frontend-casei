import { Injectable } from '@angular/core';
import {
  agregarAdscripcionUseCase,
  agregarInstitucionUseCase,
  deshabilitarAdscripcionUseCase,
  deshabilitarInstitucionUseCase,
  habilitarAdscripcionUseCase,
  habilitarInstitucionUseCase,
  obtenerListaPaisesUseCase,
  obtenerListaAdscripcionUseCase,
  obtenerListaInstitucionUseCse,
  actualizarAdscripcionUseCase,
  actualizarInstitucionUseCase,
} from '@core/index';
import { AdscripcionDto, InstitucionDto } from '@interfaces/index';
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
    return from(obtenerListaInstitucionUseCse(accessToken, page, pageSize));
  }

  getPaisesList() {
    return from(obtenerListaPaisesUseCase());
  }

  getAdscripcionesList(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaAdscripcionUseCase(accessToken, page, pageSize));
  }

  agregarInstitucion(institucionDto: InstitucionDto) {
    return from(agregarInstitucionUseCase(institucionDto));
  }

  agrearAreaAdscripcion(areaAdscripcionDto: AdscripcionDto) {
    return from(agregarAdscripcionUseCase(areaAdscripcionDto));
  }

  actualizarInstitucion(idInstitucion: number, institucionDto: InstitucionDto) {
    return from(actualizarInstitucionUseCase(idInstitucion, institucionDto));
  }

  actualizarAdscripcion(
    idAdscripcion: number,
    adscripcionDto: AdscripcionDto
  ) {
    return from(actualizarAdscripcionUseCase(idAdscripcion, adscripcionDto));
  }

  activarInstitucion(idInstitucion: number, accessToken: string) {
    return from(habilitarInstitucionUseCase(idInstitucion, accessToken));
  }

  activarAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(habilitarAdscripcionUseCase(idAdscripcion, accessToken));
  }

  desactivarInstitucion(idInstitucion: number, accessToken: string) {
    return from(deshabilitarInstitucionUseCase(idInstitucion, accessToken));
  }

  desactivarAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(deshabilitarAdscripcionUseCase(idAdscripcion, accessToken));
  }
}
