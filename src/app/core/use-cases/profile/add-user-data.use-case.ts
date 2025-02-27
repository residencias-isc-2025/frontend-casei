import { environment } from '@environments/environment';
import { NombreProfesorData, NombreProfesorResponse } from '@interfaces/index';

export const addUserDataUseCase = async (
  accessToken: string,
  user: NombreProfesorData
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/nombre-profesor/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: user.nombre,
          apellido_paterno: user.apellido_paterno,
          apellido_materno: user.apellido_materno,
        }),
      }
    );

    const data = (await resp.json()) as NombreProfesorResponse;

    if (!resp.ok) {
      return {
        ok: false,
        usuario: null,
      };
    }

    return {
      ok: true,
      mensaje: data.message,
      usuario: data.data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
