import { Injectable } from '@angular/core';
import { obtenerListaProductoAcademicoUseCase } from '@core/index';

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
}
