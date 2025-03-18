import { environment } from '@environments/environment';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { ObjetivoEspecificoData } from '@interfaces/use-cases/objetivo-especifico.response';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface ObjetivosEspecificosPagination extends PaginationResponse {
  results: ObjetivoEspecificoData[];
}

export const obtenerListaObjetivosEspecificosUseCase = async (
  searchParams: SearchParams
) => {
  const { accessToken, page, pageSize = 10 } = searchParams;

  try {
    const resp = await fetch(
      `${environment.api_url}/api/objetivos_especificos/objetivos-especificos/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as ObjetivosEspecificosPagination;

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
