import { environment } from '../../../../environments/environment';
import { UserDataResponse } from '../../../interfaces/use-cases/user-data.response';

export const getUserDataUseCase = async (accessToken: string) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/nombre-profesor/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as UserDataResponse;

    if (!resp.ok) {
      return {
        ok: false,
        usuario: null,
      };
    }

    return {
      ok: true,
      usuario: data,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
