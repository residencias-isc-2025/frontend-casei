import { environment } from '@environments/environment';

import {
  GestionAcademicaDto,
  GestionAcademicaResponse,
} from '@interfaces/index';

export const agregarGestionAcademicaUseCase = async (
  gestionAcademicaDto: GestionAcademicaDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/gestion-academica/gestion-academica/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gestionAcademicaDto.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actividad_puesto: gestionAcademicaDto.actividad_puesto,
          d_mes_anio: gestionAcademicaDto.d_mes_anio,
          a_mes_anio: gestionAcademicaDto.a_mes_anio,
          institucion_pais: gestionAcademicaDto.institucion_pais,
        }),
      }
    );

    const data = (await resp.json()) as GestionAcademicaResponse;

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
