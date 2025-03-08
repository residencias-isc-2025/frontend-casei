export interface ParticipacionResponse {
  mensaje: string;
  data?: ParticipacionData;
}

export interface ParticipacionData {
  id: number;
  usuario: number;
  organismo: string;
  periodo: number;
  nivel_p: string;
}
