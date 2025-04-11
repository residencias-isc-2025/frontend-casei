import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { IndicadorAlcance } from '@core/models/indicador-alcance.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndicadorAlcanceService extends BaseService<IndicadorAlcance> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/indicador_alcance/indicador-alcance`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: IndicadorAlcance[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: IndicadorAlcance[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<IndicadorAlcance>
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
    data: Partial<IndicadorAlcance>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: IndicadorAlcance }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: IndicadorAlcance[]
  ): IndicadorAlcance | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
