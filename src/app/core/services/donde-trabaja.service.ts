import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { DondeTrabaja } from '@core/models/donde-trabaja.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DondeTrabajaService extends BaseService<DondeTrabaja> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/donde_trabaja/donde_trabaja`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: DondeTrabaja[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: DondeTrabaja[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<DondeTrabaja>): Observable<{ mensaje: string }> {
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
    data: Partial<DondeTrabaja>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: DondeTrabaja }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: DondeTrabaja[]
  ): DondeTrabaja | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
