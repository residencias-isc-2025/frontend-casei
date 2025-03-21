import { environment } from '@environments/environment';
import { ExperienciaProfesionalResponse } from '@interfaces/index';

export const eliminarExperienciaProfesionalUseCase = async (
  idExperiencia: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/experiencia_profesional/experiencia-profesional-no-academica/${idExperiencia}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as ExperienciaProfesionalResponse;

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
