import { environment } from '@environments/environment';

import { InstitucionDto, InstitucionesResponse } from '@interfaces/index';

export const addSchoolUseCase = async (
  institucionDto: InstitucionDto
) => {
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

    const data = (await resp.json()) as InstitucionesResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Institución guardada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
