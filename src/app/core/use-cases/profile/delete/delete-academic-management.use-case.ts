import { environment } from '@environments/environment';


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

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Gestión académica borrada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
