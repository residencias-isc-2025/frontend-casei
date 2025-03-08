import { environment } from '@environments/environment';

import {
  LogroPrefesionalResponse,
  LogrosPrefesionalesDto,
} from '@interfaces/index';

export const updateProfessionalAchievementsUseCase = async (
  idLogro: number,
  logroProfesionalDto: LogrosPrefesionalesDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/logros-profesionales/${idLogro}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${logroProfesionalDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: logroProfesionalDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as LogroPrefesionalResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: data.mensaje,
      };
    }

    return {
      ok: true,
      mensaje: data.mensaje,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
