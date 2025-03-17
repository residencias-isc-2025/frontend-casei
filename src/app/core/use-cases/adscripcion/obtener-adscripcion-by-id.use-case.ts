import { environment } from '@environments/environment';
import { AdscripcionData } from '@interfaces/index';

export const obtenerAdscripcionByIdUseCase = async (
  idAdscripcion: number,
  accessToken: string
) => {
  let url = `${environment.api_url}/api/adscripcion/area-adscripcion/${idAdscripcion}/`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as AdscripcionData;

    if (!resp.ok) {
      return {
        ok: false,
        adscripcion: null,
      };
    }

    return {
      ok: true,
      adscripcion: data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
