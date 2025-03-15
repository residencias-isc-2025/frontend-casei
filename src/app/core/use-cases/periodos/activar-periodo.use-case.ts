import { environment } from '@environments/environment';
import { PeriodoResponse } from '@interfaces/index';

export const activarPeriodoUseCase = async (
  idPeriodo: number,
  accessToken: string
) => {
  try {
    const resp = await fetch(`${environment.api_url}/api/periodos/activar-periodo/${idPeriodo}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as PeriodoResponse;

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
