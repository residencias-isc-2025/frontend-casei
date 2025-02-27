import { environment } from '@environments/environment';
import { CreateUserInterface, CreateUserResponse } from '@interfaces/index';

export const createUserUseCase = async (user: CreateUserInterface) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/register/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          role: user.role,
          tipo_docente: user.type,
        }),
      }
    );

    const data = (await resp.json()) as CreateUserResponse;

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
