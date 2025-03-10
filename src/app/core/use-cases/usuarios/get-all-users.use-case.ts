import { environment } from '@environments/environment';
import { SearchParams } from '@interfaces/dtos/search-params.dto';
import { UserResponse } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface UsersListInterface extends PaginationResponse {
  results: UserResponse[];
}

export const getAllUsersUseCase = async (searchParams: SearchParams) => {
  const {
    page,
    accessToken,
    nomina = '',
    nombre = '',
    estado = '',
    area_adscripcion = '',
  } = searchParams;

  let url = `${environment.api_url}/registration/users/?page=${page}`;

  if (nomina !== '') url += `&username=${nomina}`;
  if (nombre !== '') url += `&nombre=${nombre}`;
  if (area_adscripcion !== '') url += `&area_adscripcion=${area_adscripcion}`;
  if (estado !== '') url += `&estado=${estado}`;

  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

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
