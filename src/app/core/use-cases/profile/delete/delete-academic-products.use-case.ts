import { environment } from '@environments/environment';

export const deleteAcademicProductsUseCase = async (
  productoId: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/productos-academicos/${productoId}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al actualizar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Producto académico borrado.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
