import { environment } from '@environments/environment';

import {
  CapacitacionDocenteDto,
  CapacitacionDocenteResponse,
} from '@interfaces/index';

export const actualizarCapacitacionDocenteUseCase = async (
  idCapacitacion: number,
  teachingTraining: CapacitacionDocenteDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/capacitacion_docente/capacitacion-docente/${idCapacitacion}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${teachingTraining.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_capacitacion: teachingTraining.tipo_capacitacion,
          institucion_pais: teachingTraining.institucion_pais,
          anio_obtencion: teachingTraining.anio_obtencion,
          horas: teachingTraining.horas,
        }),
      }
    );

    const data = (await resp.json()) as CapacitacionDocenteResponse;

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
