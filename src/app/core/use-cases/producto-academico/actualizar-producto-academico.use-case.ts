import { environment } from '@environments/environment';

import {
  ProductoAcademicoDto,
  ProductoAcademicoResponse,
} from '@interfaces/index';

export const updateAcademicProductsUseCase = async (
  productoId: number,
  productoAcademicoDto: ProductoAcademicoDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/productos_academicos/productos-academicos/${productoId}/`,
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

    const data = (await resp.json()) as ProductoAcademicoResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: data.mensaje,
      };
    }

    return {
      ok: true,
      mensaje: data.mensaje,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
