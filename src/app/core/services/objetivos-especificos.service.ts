import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ObjetivoEspecifico } from '@core/models/objetivo-especifico.model';
import { BaseService } from '@core/classes/base-service.class';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ObjetivosEspecificosService extends BaseService<ObjetivoEspecifico> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/objetivos_especificos`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ObjetivoEspecifico[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ObjetivoEspecifico[];
    }>(`${this.apiUrl}/objetivos-especificos/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<ObjetivoEspecifico>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/objetivos-especificos/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/objetivos-especificos/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<ObjetivoEspecifico>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: ObjetivoEspecifico }>(
      `${this.apiUrl}/objetivos-especificos/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: ObjetivoEspecifico[]
  ): ObjetivoEspecifico | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
