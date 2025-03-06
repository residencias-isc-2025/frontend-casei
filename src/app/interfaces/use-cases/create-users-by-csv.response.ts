export interface CreateUsersByCSVResponse {
  mensaje: string;
  resultado: Resultado;
}

export interface Resultado {
  usuarios_creados: string[];
  errores: any[];
}
