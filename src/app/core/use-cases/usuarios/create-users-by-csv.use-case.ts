import { environment } from '@environments/environment';
import { CreateUsersByCSVResponse } from '@interfaces/index';

export const createUsersByCsvUseCase = async (
  accessToken: string,
  formData: FormData
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/usuarios/create-users-by-csv/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    const data = (await resp.json()) as CreateUsersByCSVResponse;

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
