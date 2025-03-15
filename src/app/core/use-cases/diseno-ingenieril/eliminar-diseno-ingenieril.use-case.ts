import { environment } from '@environments/environment';
import { DisenoIngenierilResponse } from '@interfaces/index';

export const eliminarDisenoIngenierilUseCase = async (
  idDiseno: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/experiencia_diseno/experiencia-diseno-ingenieril/${idDiseno}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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
