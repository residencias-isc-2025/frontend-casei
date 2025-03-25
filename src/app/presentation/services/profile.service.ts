import { Injectable } from '@angular/core';
import {
  obtenerListaProductoAcademicoUseCase,
  obtenerListaPremioUseCase,
} from '@core/index';

import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  loadProductosAcademicosFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(
      obtenerListaProductoAcademicoUseCase(accessToken, page, pageSize)
    );
  }

  loadPremiosFunction(
    accessToken: string,
    page: number,
    pageSize: number = 10
  ) {
    return from(obtenerListaPremioUseCase(accessToken, page, pageSize));
  }
}
