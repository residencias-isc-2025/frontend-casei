import { environment } from '@environments/environment';

import {
  FormacionAcademicaDto,
  FormacionAcademicaResponse,
} from '@interfaces/index';

export const actualizarFormacionAcademicaUseCase = async (
  idFormacion: number,
  academicTraining: FormacionAcademicaDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/formacion_academica/formacion-academica/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${academicTraining.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: idFormacion,
          nivel: academicTraining.level,
          nombre: academicTraining.name,
          institucion_pais: academicTraining.institution,
          anio_obtencion: academicTraining.year,
          cedula_profesional: academicTraining.code,
        }),
      }
    );

    const data = (await resp.json()) as FormacionAcademicaResponse;

    console.log(data);

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
