import { environment } from '@environments/environment';
import { LogroPrefesionalResponse } from '@interfaces/index';

export const deleteProfessionalAchievementsUseCase = async (
  idLogro: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/logros-profesionales/${idLogro}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as LogroPrefesionalResponse;

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
