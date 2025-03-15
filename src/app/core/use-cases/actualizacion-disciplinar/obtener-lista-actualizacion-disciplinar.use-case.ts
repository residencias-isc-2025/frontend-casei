import { environment } from '@environments/environment';
import { ActualizacionDisciplinarData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface ActualizacionDisciplinarPagination extends PaginationResponse{
  results: ActualizacionDisciplinarData[];
}

export const obtenerListaActualizacionDisplinarUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/actualizacion_diciplinar/actualizacion-disciplinar/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as ActualizacionDisciplinarPagination;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
        data: [],
      };
    }

    return {
      ok: true,
      items: data.count,
      data: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
