export interface CapacitacionDocenteResponse {
  mensaje: string;
  data?: CapacitacionDocenteData;
}

export interface CapacitacionDocenteData {
  id: number;
  tipo_capacitacion: string;
  institucion_pais: number;
  anio_obtencion: number;
  horas: number;
}
