export interface InstitucionResponse {
  mensaje: string;
  data: InstitucionData;
}
export interface InstitucionData {
  id: number;
  nombre_institucion: string;
  pais: string;
  estado: string;
}
