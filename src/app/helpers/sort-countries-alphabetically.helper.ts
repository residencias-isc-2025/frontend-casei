import { Countries } from '@core/models/countries.model';

export const sortCountriesAlphabetically = (
  list: Countries[],
  ascending: boolean = true
): Countries[] => {
  return [...list].sort((a, b) => {
    const valueA = String(a.name.common.toLowerCase());
    const valueB = String(b.name.common.toLowerCase());

    if (valueA < valueB) return ascending ? -1 : 1;
    if (valueA > valueB) return ascending ? 1 : -1;

    return 0;
  });
};
