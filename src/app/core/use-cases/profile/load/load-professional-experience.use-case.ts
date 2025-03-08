import { environment } from '@environments/environment';
import { ExperienciaProfesionalResponse } from '@interfaces/index';

interface ExperienciaProfesionalInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: ExperienciaProfesionalResponse[];
}

export const loadProfessionalExperienceUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/experiencia-profesional-no-academica/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as ExperienciaProfesionalInterface;

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
