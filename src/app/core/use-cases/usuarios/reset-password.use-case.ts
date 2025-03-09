import { environment } from '@environments/environment';

export const resetPasswordUseCase = async (
  accessToken: string,
  userId: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/registration/reset-password/${userId}/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await resp.json();

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: data.error,
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
