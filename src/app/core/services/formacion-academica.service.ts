import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormacionAcademica } from '@core/models/formacion-academica.model';
import { BaseService } from '@core/classes/base-service.class';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormacionAcademicaService extends BaseService<FormacionAcademica> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/formacion_academica`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: FormacionAcademica[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: FormacionAcademica[];
    }>(`${this.apiUrl}/formacion-academica/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<FormacionAcademica>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/objetivos-especificos/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/formacion-academica/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<FormacionAcademica>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: FormacionAcademica }>(
      `${this.apiUrl}/formacion-academica/`,
      {
        ...data,
        id,
      }
    );
  }
}
