import { environment } from '@environments/environment';

export const resetPasswordUseCase = async (
  accessToken: string,
  payrollNumber: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/reset-password/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: payrollNumber,
        }),
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
