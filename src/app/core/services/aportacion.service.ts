import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Aportacion } from '@core/models/aportacion.model';
import { BaseService } from '@core/classes/base-service.class';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AportacionService extends BaseService<Aportacion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/aportaciones`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Aportacion[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Aportacion[];
    }>(`${this.apiUrl}/aportaciones/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<Aportacion>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/aportaciones/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/aportaciones/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<Aportacion>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/aportaciones/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Aportacion[]
  ): Aportacion | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
