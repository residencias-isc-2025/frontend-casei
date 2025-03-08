export interface GestionAcademicaResponse {
  mensaje: string;
  data?: GestionAcademicaData;
}

export interface GestionAcademicaData {
  id: number;
  actividad_puesto: string;
  institucion_pais: number;
  d_mes_anio: Date;
  a_mes_anio: Date;
  usuario: number;
}
