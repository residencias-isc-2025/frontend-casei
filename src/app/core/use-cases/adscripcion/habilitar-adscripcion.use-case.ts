import { environment } from '@environments/environment';

export const habilitarAdscripcionUseCase = async (
  idAdscripcion: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/adscripcion/habilitar-area-adscripcion/${idAdscripcion}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await resp.json();

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
