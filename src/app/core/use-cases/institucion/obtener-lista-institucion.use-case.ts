import { environment } from '@environments/environment';
import { InstitucionData } from '@interfaces/index';

interface InstitucionPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: InstitucionData[];
}

export const obtenerListaInstitucionUseCse = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/institucion-pais/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

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
