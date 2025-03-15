export interface PeriodoResponse {
  mensaje: string;
  data: PeriodoData;
}

export interface PeriodoData {
  id: number;
  descripcion: string;
  clave: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  activo: boolean;
}
