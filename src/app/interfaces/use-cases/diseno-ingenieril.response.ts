export interface DisenoIngenierilResponse {
  mensaje: string;
  data?: DisenoIngenierilData;
}
export interface DisenoIngenierilData {
  id: number;
  usuario: number;
  organismo: string;
  periodo: number;
  nivel_experiencia: string;
}
