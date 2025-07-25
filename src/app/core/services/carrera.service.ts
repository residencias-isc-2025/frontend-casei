import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Carrera } from '@core/models/carrera.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CarreraService extends BaseService<Carrera> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/carrera/carrera`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any> = {}
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Carrera[];
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
      results: Carrera[];
    }>(`${this.apiUrl}/?${filters.toString()}`);
  }

  override crear(data: Partial<Carrera>): Observable<{ mensaje: string }> {
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
    data: Partial<Carrera>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: Carrera }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(id: number, lista: Carrera[]): Carrera | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  obtenerItemById(id: number) {
    return this.http.get<Carrera>(`${this.apiUrl}/${id}/`);
  }

  descargarExcel(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/exportar/`, {
      responseType: 'blob',
    });
  }
}
