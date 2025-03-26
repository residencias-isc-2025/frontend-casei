import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { LogroProfesional } from '@core/models/logro-profesional.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogroProfesionalService extends BaseService<LogroProfesional> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/logros_profesionales`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: LogroProfesional[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: LogroProfesional[];
    }>(
      `${this.apiUrl}/logros-profesionales/?page=${page}&page_size=${limit}`
    );
  }

  override crear(
    data: Partial<LogroProfesional>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/logros-profesionales/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/logros-profesionales/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<LogroProfesional>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/logros-profesionales/${id}/`,
      data
    );
  }
}
