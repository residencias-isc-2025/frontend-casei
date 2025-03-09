import { environment } from '@environments/environment';
import { UpdateUserDto, UpdateUserResponse } from '@interfaces/index';

export const updateUserUseCase = async (
  accessToken: string,
  user: UpdateUserDto
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/register/${user.id}/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: user.nombre,
          apellido_paterno: user.apellido_paterno,
          apellido_materno: user.apellido_materno,
          fecha_nacimiento: user.fecha_nacimiento,
        }),
      }
    );

    const data = (await resp.json()) as UpdateUserResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: data.mensaje,
        usuario: null,
      };
    }

    return {
      ok: true,
      mensaje: data.mensaje,
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
