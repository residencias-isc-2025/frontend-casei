import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { ActividadAprendizaje } from '@core/models/actividad-aprendizaje.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadAprendizajeService extends BaseService<ActividadAprendizaje> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/actividad_aprendizaje`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ActividadAprendizaje[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ActividadAprendizaje[];
    }>(`${this.apiUrl}/actividad-aprendizaje/?page=${page}&page_size=${limit}`);
  }
  override crear(
    data: Partial<ActividadAprendizaje>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/actividad-aprendizaje/`,
      data
    );
  }
  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/actividad-aprendizaje/${id}/`
    );
  }
  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }
  override actualizar(
    id: number,
    data: Partial<ActividadAprendizaje>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: ActividadAprendizaje }>(
      `${this.apiUrl}/actividad-aprendizaje/${id}/`,
      data
    );
  }
}
