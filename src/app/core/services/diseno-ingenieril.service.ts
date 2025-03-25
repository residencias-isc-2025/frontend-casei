import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/bae-service.class';
import { DisenoIngenieril } from '@core/models/diseno-ingenieril.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DisenoIngenierilService extends BaseService<DisenoIngenieril> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/experiencia_diseno`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: DisenoIngenieril[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DisenoIngenieril[];
    }>(
      `${this.apiUrl}/experiencia-diseno-ingenieril/?page=${page}&page_size=${limit}`
    );
  }

  override crear(
    data: Partial<DisenoIngenieril>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-diseno-ingenieril/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-diseno-ingenieril/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<DisenoIngenieril>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-diseno-ingenieril/${id}/`,
      data
    );
  }
}
