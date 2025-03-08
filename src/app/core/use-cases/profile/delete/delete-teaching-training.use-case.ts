import { environment } from '@environments/environment';

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

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos. Verifique la información ingresada.',
      };
    }

    return {
      ok: true,
      mensaje: 'Capacitación docente borrada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
