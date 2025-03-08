import { environment } from '@environments/environment';

import { AportacionData } from '@interfaces/index';

interface AportacionesPagination {
  count: number;
  next: string | null;
  previous: string | null;
  results: AportacionData[];
}

export const loadContributionsUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/aportaciones/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as AportacionesPagination;

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
