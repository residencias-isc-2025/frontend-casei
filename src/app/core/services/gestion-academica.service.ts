import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/bae-service.class';
import { GestionAcademica } from '@core/models/gestion-academica.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GestionAcademicaService extends BaseService<GestionAcademica> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/gestion_academica`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: GestionAcademica[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: GestionAcademica[];
    }>(`${this.apiUrl}/gestion-academica/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<GestionAcademica>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/gestion-academica/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/gestion-academica/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<GestionAcademica>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/gestion-academica/${id}/`,
      data
    );
  }
}
