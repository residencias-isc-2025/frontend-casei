import { environment } from '@environments/environment';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { InstitucionData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface InstitucionPagination extends PaginationResponse {
  results: InstitucionData[];
}

export const obtenerListaInstitucionUseCase = async (
  searchParams: SearchParams
) => {
  const {
    page,
    pageSize = 10,
    accessToken,
    nombre = '',
    pais = '',
    estado = '',
  } = searchParams;

  let url = `${environment.api_url}/api/institucion/institucion-pais/?page=${page}&page_size=${pageSize}`;

  if (nombre !== '') url += `&institucion=${nombre}`;
  if (pais !== '') url += `&pais=${pais}`;
  if (estado !== '') url += `&estado=${estado}`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as InstitucionPagination;

    if (!resp.ok) {
      return {
        ok: false,
        schools: [],
      };
    }

    return {
      ok: true,
      items: data.count,
      schools: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
