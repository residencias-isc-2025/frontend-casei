import { CreateUserInterface } from '../../interfaces/dtos/create-user.dto';
import { environment } from '../../../environments/environment';
import { CreateUserResponse } from '../../interfaces/use-cases/create-user.response';

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
