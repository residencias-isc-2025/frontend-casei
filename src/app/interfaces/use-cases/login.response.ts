export interface LoginResponse {
  mensaje: string;
  tokens:  Tokens;
}
export interface Tokens {
  refresh: string;
  access:  string;
}
