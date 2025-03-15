import { environment } from '@environments/environment';
import { PeriodoDto, PeriodoResponse } from '@interfaces/index';

export const actualizarPeriodoUseCase = async (
  idPeriodo: number,
  periodoDto: PeriodoDto
) => {
  try {
    const resp = await fetch(`${environment.api_url}/api/periodos/periodo/${idPeriodo}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${periodoDto.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        descripcion: periodoDto.descripcion,
        clave: periodoDto.clave,
        fecha_inicio: periodoDto.fecha_inicio,
        fecha_fin: periodoDto.fecha_fin,
      }),
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
