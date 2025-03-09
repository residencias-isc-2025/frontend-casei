import { CountriesResponse } from '@interfaces/index';

export const sortCountriesAlphabetically = (
  list: CountriesResponse[],
  ascending: boolean = true
): CountriesResponse[] => {
  return [...list].sort((a, b) => {
    const valueA = String(a.name.common.toLowerCase());
    const valueB = String(b.name.common.toLowerCase());

    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;

    return 0;
  });
};
