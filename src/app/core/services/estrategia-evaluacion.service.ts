import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { EstrategiaEvaluacion } from '@core/models/estrategia-evaluacion.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstrategiaEvaluacionService extends BaseService<EstrategiaEvaluacion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/estrategia_evaluacion`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: EstrategiaEvaluacion[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: EstrategiaEvaluacion[];
    }>(`${this.apiUrl}/estrategia-evaluacion/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<EstrategiaEvaluacion>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/estrategia-evaluacion/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/estrategia-evaluacion/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<EstrategiaEvaluacion>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/estrategia-evaluacion/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: EstrategiaEvaluacion[]
  ): EstrategiaEvaluacion | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
