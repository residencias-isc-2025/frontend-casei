import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { NivelDesempenio } from '@core/models/nivel-desempenio.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NivelDesempenioService extends BaseService<NivelDesempenio> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/nivel_desempenio/nivel-desempenio`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: NivelDesempenio[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: NivelDesempenio[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<NivelDesempenio>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/`, data);
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}/`);
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<NivelDesempenio>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: NivelDesempenio }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: NivelDesempenio[]
  ): NivelDesempenio | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
