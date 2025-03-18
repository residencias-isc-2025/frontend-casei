import { environment } from '@environments/environment';
import { ObjetivoEspecificoDto } from '@interfaces/dtos/objetivo-especifico.dto';
import { ObjetivoEspecificoResponse } from '@interfaces/use-cases/objetivo-especifico.response';

export const agregarObjetivoEspecificoUseCase = async (
  objetivoDto: ObjetivoEspecificoDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/objetivos_especificos/objetivos-especificos/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${objetivoDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          descripcion: objetivoDto.descripcion,
        }),
      }
    );

    const data = (await resp.json()) as ObjetivoEspecificoResponse;

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
