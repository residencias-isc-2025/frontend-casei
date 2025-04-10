export interface Tema {
  id: number;
  nombre: string;
  objetivo: string;
  criterio_desempeno: number | null;
  estrategia_ensenanza: number;
  estrategia_evaluacion: number;
  practica: number;
  sub_temas: number[];
}
