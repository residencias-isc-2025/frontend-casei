import { environment } from '@environments/environment';

import {
  ActualizacionDisciplinarDto,
  ActualizacionDisciplinarResponse,
} from '@interfaces/index';

export const actualizarActualizacionDisciplinarUseCase = async (
  idActualizacion: number,
  actualizacionDisciplinarDto: ActualizacionDisciplinarDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/actualizacion_diciplinar/actualizacion-disciplinar/${idActualizacion}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${actualizacionDisciplinarDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_actualizacion: actualizacionDisciplinarDto.tipo_actualizacion,
          anio_obtencion: actualizacionDisciplinarDto.anio_obtencion,
          horas: actualizacionDisciplinarDto.horas,
          institucion_pais: actualizacionDisciplinarDto.institucion_pais,
        }),
      }
    );

    const data = (await resp.json()) as ActualizacionDisciplinarResponse;

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
