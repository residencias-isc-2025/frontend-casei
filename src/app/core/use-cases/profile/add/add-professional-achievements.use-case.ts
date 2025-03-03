import { environment } from '@environments/environment';

import {

  LogrosPrefesionalesResponse,
  LogrosPrefesionalesDto,
} from '@interfaces/index';

export const addProfessionalAchievementsUseCase = async (
  logroProfesionalDto: LogrosPrefesionalesDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/logros-profesionales/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${logroProfesionalDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: logroProfesionalDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as LogrosPrefesionalesResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Logro profesional guardado.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
