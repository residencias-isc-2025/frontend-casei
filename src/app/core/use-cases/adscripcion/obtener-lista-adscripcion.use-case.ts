import { environment } from '@environments/environment';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { AdscripcionData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface AdscripcionesPagination extends PaginationResponse {
  results: AdscripcionData[];
}

export const obtenerListaAdscripcionUseCase = async (
  searchParams: SearchParams
) => {
  const {
    page,
    pageSize = 10,
    accessToken,
    nombre = '',
    estado = '',
    siglas = '',
  } = searchParams;

  let url = `${environment.api_url}/api/adscripcion/area-adscripcion/?page=${page}&page_size=${pageSize}`;

  if (nombre !== '') url += `&nombre=${nombre}`;
  if (estado !== '') url += `&estado=${estado}`;
  if (siglas !== '') url += `&siglas=${siglas}`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as AdscripcionesPagination;

    if (!resp.ok) {
      return {
        ok: false,
        adscripciones: [],
      };
    }

    return {
      ok: true,
      items: data.count,
      adscripciones: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
