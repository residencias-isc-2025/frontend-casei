import { environment } from '@environments/environment';

import { PremiosResponse, PremiosDto } from '@interfaces/index';

export const updateAwardsUseCase = async (
  idPremio: number,
  premiosDto: PremiosDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/premios/${idPremio}/`,
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

    const data = (await resp.json()) as PremiosResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Premio actualizado.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
