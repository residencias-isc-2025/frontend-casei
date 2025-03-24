import { Injectable } from '@angular/core';
import { obtenerListaPaisesUseCase } from '@core/index';
import { obtenerListaObjetivosEspecificosUseCase } from '@core/use-cases/objetivos-especificos/obtener-lista-objetivos-especificos.use-case';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
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

  getObjetivosEspecificosList(searchParams: SearchParams) {
    return from(obtenerListaObjetivosEspecificosUseCase(searchParams));
  }

  agregarObjetivoEspecifico(objetivoDto: ObjetivoEspecificoDto) {
    return from(agregarObjetivoEspecificoUseCase(objetivoDto));
  }

  actualizarObjetivoEspecifico(
    idObjetivo: number,
    objetivoDto: ObjetivoEspecificoDto
  ) {
    return from(editarObjetivoEspecificoUseCase(idObjetivo, objetivoDto));
  }

  eliminarObjetivoEspecifico(idObjetivo: number, accessToken: string) {
    return from(eliminarObjetivoEspecificoUseCase(idObjetivo, accessToken));
  }
}
