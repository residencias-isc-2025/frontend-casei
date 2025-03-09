import { environment } from '@environments/environment';
import { CreateUserResponse } from '@interfaces/index';

export const changePasswordUseCase = async (
  accessToken: string,
  newPassword: string
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/registration/change-password/`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          new_password: newPassword,
        }),
      }
    );

    const data = (await resp.json()) as CreateUserResponse;

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
