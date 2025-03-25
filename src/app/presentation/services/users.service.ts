import { Injectable } from '@angular/core';
import { from } from 'rxjs';

import { ProductoAcademicoDto } from '@interfaces/index';

import {
  agregarProductoAcademicoUseCase,
  eliminarProductoAcademicoUseCase,
  updateAcademicProductsUseCase,
} from '@core/index';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  //#region Productos académicos
  agregarProductosAcademicos(productosAcademicosDto: ProductoAcademicoDto) {
    return from(agregarProductoAcademicoUseCase(productosAcademicosDto));
  }

  actualizarProductosAcademicos(
    idProducto: number,
    productosAcademicosDto: ProductoAcademicoDto
  ) {
    return from(
      updateAcademicProductsUseCase(idProducto, productosAcademicosDto)
    );
  }

  borrarProductosAcademicos(idProducto: number, accessToken: string) {
    return from(eliminarProductoAcademicoUseCase(idProducto, accessToken));
  }
  //#endregion
}
