export interface SearchParams {
  accessToken: string;
  page: number;
  pageSize?: number;
  nomina?: string;
  nombre?: string;
  area_adscripcion?: string;
  estado?: string;
  pais?: string;
  siglas?: string;
  activo?: number;
}
