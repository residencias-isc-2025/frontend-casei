import { environment } from '@environments/environment';
import { ActualizacionDisciplinarResponse } from '@interfaces/index';

export const eliminarActualizacionDisciplinarUseCase = async (
  idActualizacion: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/actualizacion_diciplinar/actualizacion-disciplinar/${idActualizacion}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as ActualizacionDisciplinarResponse;

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
