import { environment } from '@environments/environment';

import {
  LogroPrefesionalResponse,
  LogroPrefesionalDto,
} from '@interfaces/index';

export const agregarLogroProfesionalUseCase = async (
  logroProfesionalDto: LogroPrefesionalDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/logros_profesionales/logros-profesionales/`,
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
