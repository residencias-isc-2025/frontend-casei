import { environment } from '@environments/environment';
import { UserResponse } from '@interfaces/index';

export const getUserUseCase = async (accessToken: string) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/profile/`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as UserResponse;

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
