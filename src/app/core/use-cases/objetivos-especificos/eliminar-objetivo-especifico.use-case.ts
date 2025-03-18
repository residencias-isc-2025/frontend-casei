import { environment } from '@environments/environment';
import { ObjetivoEspecificoResponse } from '@interfaces/use-cases/objetivo-especifico.response';

export const eliminarObjetivoEspecificoUseCase = async (
  idObjetivo: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/objetivos_especificos/objetivos-especificos/${idObjetivo}/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
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
