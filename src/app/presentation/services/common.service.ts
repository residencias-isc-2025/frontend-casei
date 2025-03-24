import { actualizarPeriodoUseCase } from './../../core/use-cases/periodos/actualizar-periodo.use-case';
import { Injectable } from '@angular/core';
import { obtenerListaPaisesUseCase } from '@core/index';
import { obtenerListaObjetivosEspecificosUseCase } from '@core/use-cases/objetivos-especificos/obtener-lista-objetivos-especificos.use-case';
import { activarPeriodoUseCase } from '@core/use-cases/periodos/activar-periodo.use-case';
import { agregarPeriodoUseCase } from '@core/use-cases/periodos/agregar-periodo.use-case';
import { desactivarPeriodoUseCase } from '@core/use-cases/periodos/desactivar-periodo.use-case';
import { obtenerListaPeriodosUseCase } from '@core/use-cases/periodos/obtener-lista-periodos.use-case';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { AdscripcionDto, InstitucionDto, PeriodoDto } from '@interfaces/index';
import { from } from 'rxjs';
import { eliminarObjetivoEspecificoUseCase } from '@core/use-cases/objetivos-especificos/eliminar-objetivo-especifico.use-case';
import { ObjetivoEspecificoDto } from '@interfaces/dtos/objetivo-especifico.dto';
import { agregarObjetivoEspecificoUseCase } from '../../core/use-cases/objetivos-especificos/agregar-objetivo-especifico.use-case';
import { editarObjetivoEspecificoUseCase } from '@core/use-cases/objetivos-especificos/editar-objetivo-especifico.use-case';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getPaisesList() {
    return from(obtenerListaPaisesUseCase());
  }

  getPeriodosList(searchParams: SearchParams) {
    return from(obtenerListaPeriodosUseCase(searchParams));
  }

  getObjetivosEspecificosList(searchParams: SearchParams) {
    return from(obtenerListaObjetivosEspecificosUseCase(searchParams));
  }

  agregarPeriodo(periodoDto: PeriodoDto) {
    return from(agregarPeriodoUseCase(periodoDto));
  }

  agregarObjetivoEspecifico(objetivoDto: ObjetivoEspecificoDto) {
    return from(agregarObjetivoEspecificoUseCase(objetivoDto));
  }

  actualizarPeriodo(idPeriodo: number, periodoDto: PeriodoDto) {
    return from(actualizarPeriodoUseCase(idPeriodo, periodoDto));
  }

  actualizarObjetivoEspecifico(
    idObjetivo: number,
    objetivoDto: ObjetivoEspecificoDto
  ) {
    return from(editarObjetivoEspecificoUseCase(idObjetivo, objetivoDto));
  }

  activarPeriodo(idPeriodo: number, accessToken: string) {
    return from(activarPeriodoUseCase(idPeriodo, accessToken));
  }

  desactivarPeriodo(idPeriodo: number, accessToken: string) {
    return from(desactivarPeriodoUseCase(idPeriodo, accessToken));
  }

  eliminarObjetivoEspecifico(idObjetivo: number, accessToken: string) {
    return from(eliminarObjetivoEspecificoUseCase(idObjetivo, accessToken));
  }
}
