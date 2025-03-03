import { environment } from '@environments/environment';

import { AportacionesResponse, AportacionesDto } from '@interfaces/index';

export const updateContributionUseCase = async (
  idAportacion: number,

  aportacionDto: AportacionesDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/aportaciones/${idAportacion}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${aportacionDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: aportacionDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as AportacionesResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Aportación actualizada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
