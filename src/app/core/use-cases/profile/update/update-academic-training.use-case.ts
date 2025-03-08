import { environment } from '@environments/environment';

import {
  FormacionAcademicaDto,
  FormacionAcademicaResponse,
} from '@interfaces/index';

export const updateAcademicTrainingUseCase = async (
  idFormacion: number,
  academicTraining: FormacionAcademicaDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/formacion-academica/`,
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

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al guardar datos. Verifique la información ingresada.',
      };
    }

    return {
      ok: true,
      mensaje: 'Formación académica actualizada.',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
