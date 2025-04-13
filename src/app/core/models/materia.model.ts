export interface Materia {
  id: number;
  clave: string;
  nombre: string;
  competencias: number[];
  creditos_requeridos: number;
  materias_requeridas: number[];
  semestre: string;
  tipo_curso: boolean;
  creditos_teoria: number;
  creditos_practica: number;
  horas_ciencias_basicas: number;
  horas_ciencias_ingenieria: number;
  horas_ingenieria_aplicada: number;
  horas_disenio_ingenieril: number;
  horas_ciencias_sociales: number;
  horas_ciencias_economicas: number;
  horas_otros_cursos: number;
  objetivo_general: string;
  indicador_descripcion: string;
  criterio_desempeno: number[];
  bibliografia: number[];
}
