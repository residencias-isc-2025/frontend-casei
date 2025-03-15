import { environment } from '@environments/environment';

import { PremioResponse, PremiosDto } from '@interfaces/index';

export const actualizarPremioUseCase = async (
  idPremio: number,
  premiosDto: PremiosDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/premios/premios/${idPremio}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${premiosDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: premiosDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as PremioResponse;

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
