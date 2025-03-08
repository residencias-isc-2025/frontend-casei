import { environment } from '@environments/environment';

import { AportacionesDto, AportacionResponse } from '@interfaces/index';

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

    const data = (await resp.json()) as AportacionResponse;

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
