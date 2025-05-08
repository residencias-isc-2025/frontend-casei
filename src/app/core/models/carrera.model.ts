export interface Carrera {
  id: number;
  nombre: string;
  adscripcion: number;
  objetivo_especifico: number[];
  atributos_egreso: number[];
  mision: string;
  vision: string;
  objetivo_carrera: string;
  is_active: boolean;
}
