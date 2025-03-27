import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Practica } from '@core/models/practica.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PracticaService extends BaseService<Practica> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/practica`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Practica[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Practica[];
    }>(`${this.apiUrl}/practica/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<Practica>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/practica/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/practica/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<Practica>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/practica/${id}/`,
      data
    );
  }

  practicaData(id: number, lista: Practica[]) {
    const practica = lista.find((p) => p.id === id);
    return practica;
  }
}
