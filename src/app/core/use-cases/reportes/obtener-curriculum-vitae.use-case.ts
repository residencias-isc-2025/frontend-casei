import { environment } from '@environments/environment';
import { CurriculumVitaeResponse } from '@interfaces/index';

export const obtenerCurriculumVitaeUseCase = async (accessToken: string) => {
  try {
    const resp = await fetch(`${environment.api_url}/api/reportes/curriculum-vitae/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as CurriculumVitaeResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: "Error al obtener información del CV0"
      };
    }

    return {
      ok: true,
      informacion: data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
