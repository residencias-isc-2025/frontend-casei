import { environment } from '@environments/environment';
import { CapacitacionDocenteResponse } from '@interfaces/index';

export const deleteTeachingTrainingUseCase = async (
  idCapacitacion: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/capacitacion-docente/${idCapacitacion}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as CapacitacionDocenteResponse;

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
