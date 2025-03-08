import { environment } from '@environments/environment';

import { InstitucionDto, InstitucionResponse } from '@interfaces/index';

export const addSchoolUseCase = async (institucionDto: InstitucionDto) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/institucion-pais/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${institucionDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_institucion: institucionDto.nombre_institucion,
          pais: institucionDto.pais,
        }),
      }
    );

    const data = (await resp.json()) as InstitucionResponse;

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
