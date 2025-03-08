import { environment } from '@environments/environment';
import { GestionAcademicaResponse } from '@interfaces/index';

export const deleteAcademicManagmentUseCase = async (
  gestionId: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/gestion-academica/${gestionId}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as GestionAcademicaResponse;

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
