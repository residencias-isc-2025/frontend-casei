export interface PremioResponse {
  mensaje: string;
  data?: PremioData;
}

export interface PremioData {
  id: number;
  descripcion: string;
  usuario: number;
}
