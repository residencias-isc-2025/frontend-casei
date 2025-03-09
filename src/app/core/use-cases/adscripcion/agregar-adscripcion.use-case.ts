import { environment } from '@environments/environment';

import { AdscripcionDto, AdscripcionResponse } from '@interfaces/index';

export const agregarAdscripcionUseCase = async (areaAdscripcionDto: AdscripcionDto) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/area-adscripcion/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${areaAdscripcionDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: areaAdscripcionDto.nombre,
          siglas: areaAdscripcionDto.siglas,
        }),
      }
    );

    const data = (await resp.json()) as AdscripcionResponse;

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
