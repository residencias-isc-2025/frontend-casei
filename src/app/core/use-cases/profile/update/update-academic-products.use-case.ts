import { environment } from '@environments/environment';

import {
  ProductosAcademicosDto,
  ProductosAcademicosResponse,
} from '@interfaces/index';

export const updateAcademicProductsUseCase = async (
  productoId: number,
  productoAcademicoDto: ProductosAcademicosDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/productos-academicos/${productoId}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${productoAcademicoDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion_producto_academico: productoAcademicoDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as ProductosAcademicosResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al actualizar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Producto académico actualizado.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
