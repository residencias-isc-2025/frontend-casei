import { environment } from '@environments/environment';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { PeriodoData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface PeriodoPagination extends PaginationResponse {
  results: PeriodoData[];
}

export const obtenerListaPeriodosUseCase = async (
  searchParams: SearchParams
) => {
  const {
    page,
    pageSize = 10,
    accessToken,
    nombre: clave = '',
    activo,
  } = searchParams;

  let url = `${environment.api_url}/api/periodos/periodo/?page=${page}&page_size=${pageSize}`;

  if (clave !== '') url += `&clave=${clave}`;
  if (activo !== undefined) url += `&activo=${activo}`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as PeriodoPagination;

    if (!resp.ok) {
      return {
        ok: false,
        periodos: [],
      };
    }

    return {
      ok: true,
      items: data.count,
      periodos: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
