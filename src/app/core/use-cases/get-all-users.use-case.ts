import { environment } from '@environments/environment';
import { PaginationInterface, UserResponse } from '@interfaces/index';

interface UsersListInterface {
  pagination: PaginationInterface;
  results: UserResponse[];
}

export const getAllUsersUseCase = async (accessToken: string) => {
  try {
    const resp = await fetch(`${environment.api_url}/registration/users/`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = (await resp.json()) as UsersListInterface;

    console.log(data);

    if (!resp.ok) {
      return {
        ok: false,
        usuarios: [],
      };
    }

    return {
      ok: true,
      usuarios: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
