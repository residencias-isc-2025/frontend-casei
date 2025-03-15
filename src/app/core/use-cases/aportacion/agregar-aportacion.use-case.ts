import { environment } from '@environments/environment';

import { AportacionDto, AportacionResponse } from '@interfaces/index';

export const agregarAportacionUseCase = async (
  aportacionDto: AportacionDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/aportaciones/aportaciones/`,
      {
        method: 'POST',
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
