import { environment } from '@environments/environment';
import { FormacionAcademicaData } from '@interfaces/index';
import { PaginationResponse } from '@interfaces/use-cases/pagination.response';

interface FormacionAcademicaPagination extends PaginationResponse {
  results: FormacionAcademicaData[];
}

export const obtenerListaFormacionAcademicaUseCase = async (
  accessToken: string,
  page: number,
  pageSize: number
) => {
  try {
    const resp = await fetch(
      `${environment.api_url}/api/formacion_academica/formacion-academica/?page=${page}&page_size=${pageSize}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = (await resp.json()) as FormacionAcademicaPagination;

    if (!resp.ok) {
      return {
        ok: false,
        mensaje: 'Error al obtener datos.',
        data: [],
      };
    }

    return {
      ok: true,
      items: data.count,
      data: data.results,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: error,
    };
  }
};
