import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Bibliografia } from '@core/models/bibliografia.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BibliografiaService extends BaseService<Bibliografia> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/bibliografia`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Bibliografia[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Bibliografia[];
    }>(`${this.apiUrl}/bibliografia/?page=${page}&page_size=${limit}`);
  }
  override crear(data: Partial<Bibliografia>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/bibliografia/`,
      data
    );
  }
  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/bibliografia/${id}/`
    );
  }
  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }
  override actualizar(
    id: number,
    data: Partial<Bibliografia>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: Bibliografia }>(
      `${this.apiUrl}/bibliografia/${id}/`,
      data
    );
  }
}
