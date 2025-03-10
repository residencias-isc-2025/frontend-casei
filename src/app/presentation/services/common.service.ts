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
  obtenerListaInstitucionUseCase,
  actualizarAdscripcionUseCase,
  actualizarInstitucionUseCase,
} from '@core/index';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { AdscripcionDto, InstitucionDto } from '@interfaces/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getInstitucionesList(searchParams: SearchParams) {
    return from(obtenerListaInstitucionUseCase(searchParams));
  }

  getPaisesList() {
    return from(obtenerListaPaisesUseCase());
  }

  getAdscripcionesList(searchParams: SearchParams) {
    return from(obtenerListaAdscripcionUseCase(searchParams));
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

  actualizarAdscripcion(idAdscripcion: number, adscripcionDto: AdscripcionDto) {
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
