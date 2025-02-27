import { environment } from '../../../../environments/environment';
import { FormacionAcademicaInterface } from '../../../interfaces/dtos/formacion-academica.dto';
import { FormacionAcademicaResponse } from '../../../interfaces/use-cases/formacion-academica.response';

export const addAcademicTrainingUseCase = async (
  academicTraining: FormacionAcademicaInterface
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
        mensaje: 'Error al guardar datos. Verifique la información ingresada.',
      };
    }

    return {
      ok: true,
      mensaje: data.message,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
