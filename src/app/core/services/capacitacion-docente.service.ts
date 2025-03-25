import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CapacitacionDocente } from '@core/models/capacitacion-docente.model';
import { BaseService } from '@core/classes/base-service.class';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapacitacionDocenteService extends BaseService<CapacitacionDocente> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/capacitacion_docente`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: CapacitacionDocente[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: CapacitacionDocente[];
    }>(`${this.apiUrl}/capacitacion-docente/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<CapacitacionDocente>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/capacitacion-docente/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/capacitacion-docente/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<CapacitacionDocente>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/capacitacion-docente/${id}/`,
      data
    );
  }
}
