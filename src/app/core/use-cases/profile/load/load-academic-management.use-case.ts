import { environment } from '@environments/environment';

import { GestionAcademicaResponse } from '@interfaces/index';

export const loadAcademicManagment = async (accessToken: string) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/gestion-academica/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as GestionAcademicaResponse[];

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
        data: [],
      };
    }

    return {
      ok: true,
      data: data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
