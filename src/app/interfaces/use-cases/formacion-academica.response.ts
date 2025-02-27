export interface FormacionAcademicaResponse {
  message: string;
  data: FormacionAcademicaData;
}

export interface FormacionAcademicaData {
  id: number;
  nivel: string;
  nombre: string;
  institucion_pais: string;
  anio_obtencion: number;
  cedula_profesional: string;
}
