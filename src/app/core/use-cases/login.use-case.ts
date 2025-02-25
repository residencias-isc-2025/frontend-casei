import { environment } from '../../../environments/environment.development';
import { LoginResponse } from '../../interfaces/use-cases/login.response';

export const loginUseCase = async (username: string, password: string) => {
  try {
    const resp = await fetch(`${environment.api_url}/api/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

    const data = (await resp.json()) as LoginResponse;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: data.mensaje,
      };
    }

    return {
      ok: true,
      mensaje: data.mensaje,
      tokens: data.tokens
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
