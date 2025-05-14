import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Alumno } from '@core/models/alumno.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlumnoService extends BaseService<Alumno> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/alumno/alumno`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any> = {}
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Alumno[];
  }> {
    const filters = new URLSearchParams({
      page: page.toString(),
      page_size: limit.toString(),
    });

    Object.entries(params).forEach(([key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== -1
      ) {
        filters.append(key, value);
      }
    });

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Alumno[];
    }>(`${this.apiUrl}/?${filters.toString()}`);
  }

  override crear(data: Partial<Alumno>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/`, data);
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/${id}/`);
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar/${id}/`,
      {}
    );
  }

  override actualizar(
    id: number,
    data: Partial<Alumno>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: Alumno }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(id: number, lista: Alumno[]): Alumno | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  totalRegistros(): Observable<{ total_alumnos: number }> {
    return this.http.get<{ total_alumnos: number }>(`${this.apiUrl}/count/`);
  }

  leerArchivoCsv(formData: FormData) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/carga-csv/`,
      formData
    );
  }
}
