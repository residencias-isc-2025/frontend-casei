import { environment } from '@environments/environment';
import { PremioResponse } from '@interfaces/index';

export const eliminarPremioUseCase = async (
  idPremio: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/premios/premios/${idPremio}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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
