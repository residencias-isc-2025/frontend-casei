import { environment } from '@environments/environment';

import {
  CapacitacionDocenteDto,
  CapacitacionDocenteResponse,
} from '@interfaces/index';

export const addTeachingTrainingUseCase = async (
  capacitacionDocenteDto: CapacitacionDocenteDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/capacitacion-docente/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${capacitacionDocenteDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tipo_capacitacion: capacitacionDocenteDto.tipo_capacitacion,
          anio_obtencion: capacitacionDocenteDto.anio_obtencion,
          horas: capacitacionDocenteDto.horas,
          institucion_pais: capacitacionDocenteDto.institucion_pais,
        }),
      }
    );

    const data = (await resp.json()) as CapacitacionDocenteResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos. Verifique la información ingresada.',
      };
    }

    return {
      ok: true,
      mensaje: 'Capacitación guardada con éxito.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
