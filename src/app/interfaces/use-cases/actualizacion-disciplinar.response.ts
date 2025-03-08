export interface ActualizacionDisciplinarResponse {
  mensaje: string;
  data?: ActualizacionDisciplinarData;
}
export interface ActualizacionDisciplinarData {
  id: number;
  tipo_actualizacion: string;
  institucion_pais: number;
  anio_obtencion: number;
  horas: number;
}
