export interface LogroPrefesionalResponse {
  mensaje: string;
  data?: LogroProfesionalData;
}

export interface LogroProfesionalData {
  id: number;
  descripcion: string;
  usuario: number;
}
