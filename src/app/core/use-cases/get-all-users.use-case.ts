import { environment } from '@environments/environment';
import { UserResponse } from '@interfaces/index';

interface UsersListInterface {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserResponse[];
}

export const getAllUsersUseCase = async (accessToken: string, page: number) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/registration/users/?page=${page}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as UsersListInterface;

    if (!resp.ok) {
      return {
        ok: false,
        usuarios: [],
      };
    }

    return {
      ok: true,
      items: data.count,
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
