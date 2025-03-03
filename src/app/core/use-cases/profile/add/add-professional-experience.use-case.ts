import { environment } from '@environments/environment';

import {
  ExperienciaProfesionalDto,
  ExperienciaProfesionalResponse,
} from '@interfaces/index';

export const addProfessionalExperienceUseCase = async (
  experienciaProfesionalDto: ExperienciaProfesionalDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/experiencia-profesional-no-academica/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${experienciaProfesionalDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actividad_puesto: experienciaProfesionalDto.actividad_puesto,
          d_mes_anio: experienciaProfesionalDto.d_mes_anio,
          a_mes_anio: experienciaProfesionalDto.a_mes_anio,
          organizacion_empresa: experienciaProfesionalDto.organizacion_empresa,
        }),
      }
    );

    const data = (await resp.json()) as ExperienciaProfesionalResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
      };
    }

    return {
      ok: true,
      mensaje: 'Experiencia profesional guardada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
