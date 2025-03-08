export interface AdscripcionResponse {
  mensaje: string;
  data?: AdscripcionData;
}

export interface AdscripcionData {
  id: number;
  nombre: string;
  siglas: string;
  estado: string;
}
