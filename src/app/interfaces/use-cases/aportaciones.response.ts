export interface AportacionResponse {
  mensaje: string;
  data?: AportacionData;
}

export interface AportacionData {
  id: number;
  descripcion: string;
  usuario: number;
}
