import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ActualizacionDisciplinar } from '@core/models/actualizacion-disciplinar.model';
import { BaseService } from '@core/classes/base-service.class';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActualizacionDisciplinarService extends BaseService<ActualizacionDisciplinar> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/actualizacion_diciplinar`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ActualizacionDisciplinar[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ActualizacionDisciplinar[];
    }>(
      `${this.apiUrl}/actualizacion-disciplinar/?page=${page}&page_size=${limit}`
    );
  }

  override crear(
    data: Partial<ActualizacionDisciplinar>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/actualizacion-disciplinar/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/actualizacion-disciplinar/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<ActualizacionDisciplinar>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/actualizacion-disciplinar/${id}/`,
      data
    );
  }
}
