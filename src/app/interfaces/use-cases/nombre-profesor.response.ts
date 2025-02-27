export interface NombreProfesorResponse {
  message: string;
  data: NombreProfesorData;
}

export interface NombreProfesorData {
  id: number;
  apellido_paterno: string;
  apellido_materno: string;
  nombre: string;
}
