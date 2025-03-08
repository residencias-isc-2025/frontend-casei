import { environment } from '@environments/environment';
import { FormacionAcademicaResponse } from '@interfaces/index';

export const deleteAcademicTrainingUseCase = async (
  idFormacion: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/formacion-academica/${idFormacion}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as FormacionAcademicaResponse;

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
