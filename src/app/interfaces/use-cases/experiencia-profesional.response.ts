export interface ExperienciaProfesionalResponse {
  mensaje: string;
  data?: ExperienciaProfesionalData;
}

export interface ExperienciaProfesionalData {
  id: number;
  usuario: number;
  actividad_puesto: string;
  organizacion_empresa: string;
  d_mes_anio: Date;
  a_mes_anio: Date;
}
