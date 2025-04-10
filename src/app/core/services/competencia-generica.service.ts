import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { CompetenciaGenerica } from '@core/models/competencia-generica.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompetenciaGenericaService extends BaseService<CompetenciaGenerica> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/competencias_genericas/competencias-genericas`;

  // competencias-genericas

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: CompetenciaGenerica[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: CompetenciaGenerica[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }
  override crear(
    data: Partial<CompetenciaGenerica>
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
    data: Partial<CompetenciaGenerica>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: CompetenciaGenerica }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }
}
