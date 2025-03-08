import { environment } from '@environments/environment';
import { AdscripcionData } from '@interfaces/index';

interface AdscripcionesPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdscripcionData[];
}

export const loadAdscripcionesUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/area-adscripcion/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
