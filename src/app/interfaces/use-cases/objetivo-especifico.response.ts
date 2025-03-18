export interface ObjetivoEspecificoResponse {
  mensaje: string;
  data?: ObjetivoEspecificoData;
}

export interface ObjetivoEspecificoData {
  id: number;
  descripcion: string;
}
