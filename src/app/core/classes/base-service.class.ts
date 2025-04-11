import { Observable } from 'rxjs';

export abstract class BaseService<T> {
  abstract obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }>;

  abstract crear(data: Partial<T>): Observable<{ mensaje: string }>;

  abstract deshabilitar(id: number): Observable<{ mensaje: string }>;

  abstract habilitar(id: number): Observable<{ mensaje: string }>;

  abstract actualizar(
    id: number,
    data: Partial<T>
  ): Observable<{ mensaje: string }>;

  abstract obtenerDataInfo(id: number, lista: T[]): T | undefined;
}
