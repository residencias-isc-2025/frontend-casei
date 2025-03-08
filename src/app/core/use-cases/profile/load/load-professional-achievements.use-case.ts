import { environment } from '@environments/environment';
import { LogrosPrefesionalesResponse } from '@interfaces/index';

interface LogrosProfesionalesInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: LogrosPrefesionalesResponse[];
}

export const loadProfessionalAchievementsUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/logros-profesionales/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as LogrosProfesionalesInterface;

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
