import { actualizarPeriodoUseCase } from './../../core/use-cases/periodos/actualizar-periodo.use-case';
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
import { obtenerAdscripcionByIdUseCase } from '@core/use-cases/adscripcion/obtener-adscripcion-by-id.use-case';
import { obtenerListaObjetivosEspecificosUseCase } from '@core/use-cases/objetivos-especificos/obtener-lista-objetivos-especificos.use-case';
import { activarPeriodoUseCase } from '@core/use-cases/periodos/activar-periodo.use-case';
import { agregarPeriodoUseCase } from '@core/use-cases/periodos/agregar-periodo.use-case';
import { desactivarPeriodoUseCase } from '@core/use-cases/periodos/desactivar-periodo.use-case';
import { obtenerListaPeriodosUseCase } from '@core/use-cases/periodos/obtener-lista-periodos.use-case';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { AdscripcionDto, InstitucionDto, PeriodoDto } from '@interfaces/index';
import { from } from 'rxjs';
import { eliminarObjetivoEspecificoUseCase } from '@core/use-cases/objetivos-especificos/eliminar-objetivo-especifico.use-case';

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

  getPeriodosList(searchParams: SearchParams) {
    return from(obtenerListaPeriodosUseCase(searchParams));
  }

  getObjetivosEspecificosList(searchParams: SearchParams) {
    return from(obtenerListaObjetivosEspecificosUseCase(searchParams));
  }

  agregarInstitucion(institucionDto: InstitucionDto) {
    return from(agregarInstitucionUseCase(institucionDto));
  }

  agrearAreaAdscripcion(areaAdscripcionDto: AdscripcionDto) {
    return from(agregarAdscripcionUseCase(areaAdscripcionDto));
  }

  agregarPeriodo(periodoDto: PeriodoDto) {
    return from(agregarPeriodoUseCase(periodoDto));
  }

  actualizarInstitucion(idInstitucion: number, institucionDto: InstitucionDto) {
    return from(actualizarInstitucionUseCase(idInstitucion, institucionDto));
  }

  actualizarAdscripcion(idAdscripcion: number, adscripcionDto: AdscripcionDto) {
    return from(actualizarAdscripcionUseCase(idAdscripcion, adscripcionDto));
  }

  actualizarPeriodo(idPeriodo: number, periodoDto: PeriodoDto) {
    return from(actualizarPeriodoUseCase(idPeriodo, periodoDto));
  }

  activarInstitucion(idInstitucion: number, accessToken: string) {
    return from(habilitarInstitucionUseCase(idInstitucion, accessToken));
  }

  activarAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(habilitarAdscripcionUseCase(idAdscripcion, accessToken));
  }

  activarPeriodo(idPeriodo: number, accessToken: string) {
    return from(activarPeriodoUseCase(idPeriodo, accessToken));
  }

  desactivarInstitucion(idInstitucion: number, accessToken: string) {
    return from(deshabilitarInstitucionUseCase(idInstitucion, accessToken));
  }

  desactivarAdscripcion(idAdscripcion: number, accessToken: string) {
    return from(deshabilitarAdscripcionUseCase(idAdscripcion, accessToken));
  }

  desactivarPeriodo(idPeriodo: number, accessToken: string) {
    return from(desactivarPeriodoUseCase(idPeriodo, accessToken));
  }

  eliminarObjetivoEspecifico(idObjetivo: number, accessToken: string) {
    return from(eliminarObjetivoEspecificoUseCase(idObjetivo, accessToken));
  }

  getAdscripcionById(idAdscripcion: number, accessToken: string) {
    return from(obtenerAdscripcionByIdUseCase(idAdscripcion, accessToken));
  }
}
