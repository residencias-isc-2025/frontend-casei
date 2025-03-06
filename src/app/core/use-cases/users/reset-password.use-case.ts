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

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'No se pudo re-establecer la contraseña',
      };
    }

    return {
      ok: true,
      mensaje: 'Contraseña re-establecida correctamente',
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
