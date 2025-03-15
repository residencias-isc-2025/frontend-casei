import { environment } from '@environments/environment';
import { DisenoIngenierilData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface DisenoIngenierilPagination extends PaginationResponse {
  results: DisenoIngenierilData[];
}

export const obtenerListaDisenoIngenierilUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/experiencia_diseno/experiencia-diseno-ingenieril/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as DisenoIngenierilPagination;

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
