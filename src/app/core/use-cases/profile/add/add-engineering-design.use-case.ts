import { environment } from '@environments/environment';

import {
  DisenoIngenierilResponse,
  DisenoIngenierilDto,
} from '@interfaces/index';

export const addEngineeringDesignUseCase = async (
  disenoIngenierilDto: DisenoIngenierilDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/experiencia-diseno-ingenieril/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${disenoIngenierilDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organismo: disenoIngenierilDto.organismo,
          periodo: disenoIngenierilDto.periodo,
          nivel_experiencia: disenoIngenierilDto.nivel_experiencia,
        }),
      }
    );

    const data = (await resp.json()) as DisenoIngenierilResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos.',
      };
    }

    return {
      ok: true,
      mensaje: "Experiencia en diseño ingenieril guardada.",
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
