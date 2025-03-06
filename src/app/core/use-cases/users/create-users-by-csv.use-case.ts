import { environment } from '@environments/environment';
import { CreateUsersByCSVResponse } from '@interfaces/index';

export const createUsersByCsvUseCase = async (
  accessToken: string,
  formData: FormData
) => {
  const url = `${environment.api_url}/registration/create-users-by-csv/`;

  console.log(formData);

  try {
    const resp = await fetch(
      `${environment.api_url}/registration/create-users-by-csv/`,
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
        mensaje: 'Error al crear usuarios',
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
