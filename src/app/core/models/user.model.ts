export interface User {
  id: number;
  username: string;
  role: string;
  estado: string;
  apellido_materno: null | string;
  apellido_paterno: null | string;
  nombre: null | string;
  fecha_nacimiento: null | string;
  tipo_docente: null | string;
  area_adscripcion: null | number;
  password?: string;
  grado_academico?: string;
}
