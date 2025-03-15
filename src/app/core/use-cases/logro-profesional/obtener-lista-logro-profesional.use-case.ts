import { environment } from '@environments/environment';
import { LogroProfesionalData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface LogrosProfesionalesPagination extends PaginationResponse {
  results: LogroProfesionalData[];
}

export const obtenerListaLogroProfesionalUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/logros_profesionales/logros-profesionales/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as LogrosProfesionalesPagination;

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
