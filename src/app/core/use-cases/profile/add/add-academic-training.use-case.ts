import { environment } from '@environments/environment';

import {
  FormacionAcademicaDto,
  FormacionAcademicaResponse,
} from '@interfaces/index';

export const addAcademicTrainingUseCase = async (
  academicTraining: FormacionAcademicaDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/formacion-academica/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${academicTraining.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nivel: academicTraining.level,
          nombre: academicTraining.name,
          institucion_pais: academicTraining.institution,
          anio_obtencion: academicTraining.year,
          cedula_profesional: academicTraining.code,
        }),
      }
    );

    const data = (await resp.json()) as FormacionAcademicaResponse;

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
