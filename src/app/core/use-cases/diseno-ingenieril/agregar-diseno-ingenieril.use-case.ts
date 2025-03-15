import { environment } from '@environments/environment';

import {
  DisenoIngenierilDto,
  DisenoIngenierilResponse,
} from '@interfaces/index';

export const agregarDisenoIngenierilUseCase = async (
  disenoIngenierilDto: DisenoIngenierilDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/experiencia_diseno/experiencia-diseno-ingenieril/`,
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
