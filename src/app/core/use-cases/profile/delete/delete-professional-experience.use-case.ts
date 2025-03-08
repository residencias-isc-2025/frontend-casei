import { environment } from '@environments/environment';

export const deleteProfessionalExperienceUseCase = async (
  idExperiencia: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/experiencia-profesional-no-academica/${idExperiencia}/`,
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
        mensaje: 'Error al actualizar datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Experiencia profesional borrada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
