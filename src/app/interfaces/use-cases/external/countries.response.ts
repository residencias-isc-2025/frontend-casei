export interface CountriesResponse {
  name: string;
  topLevelDomain: string[];
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: string[];
  capital?: string;
  altSpellings?: string[];
  subregion: string;
  population: number;
  latlng?: number[];
  demonym: string;
  area?: number;
  timezones: string[];
  borders?: string[];
  nativeName: string;
  numericCode: string;
  flags: Flags;
  currencies?: Currency[];

  flag: string;

  cioc?: string;
  independent: boolean;
  gini?: number;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export interface Flags {
  svg: string;
  png: string;
}
