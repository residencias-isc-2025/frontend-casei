import { sortCountriesAlphabetically } from '@helpers/sort-alphabetically.helper';
import { CountriesResponse } from '@interfaces/index';

export const getCountriesListUseCase = async () => {
  try {
    const resp = await fetch(
      'https://restcountries.com/v3.1/all',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!resp.ok) {
      console.error('Error en la respuesta:', resp.statusText);
      return {
        ok: false,
        data: [],
      };
    }

    let data = (await resp.json()) as CountriesResponse[];

    data = sortCountriesAlphabetically(data);

    return {
      ok: true,
      data,
    };
  } catch (error) {
    console.error('Error al obtener los países:', error);
    return {
      ok: false,
      error: error,
    };
  }
};
