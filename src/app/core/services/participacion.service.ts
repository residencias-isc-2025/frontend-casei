import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Participacion } from '@core/models/participacion.model';
import { environment } from '@environments/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParticipacionService extends BaseService<Participacion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/participacion`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Participacion[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Participacion[];
    }>(`${this.apiUrl}/participacion/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<Participacion>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/participacion/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/participacion/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<Participacion>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: Participacion }>(
      `${this.apiUrl}/participacion/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Participacion[]
  ): Participacion | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
