import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Institucion } from '@core/models/institucion.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InstitucionService extends BaseService<Institucion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/institucion`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any> = {}
  ) {
    const filters = new URLSearchParams({
      page: page.toString(),
      page_size: limit.toString(),
    });

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filters.append(key, value);
      }
    });

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Institucion[];
    }>(`${this.apiUrl}/institucion-pais/?${filters.toString()}`);
  }

  override crear(data: Partial<Institucion>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/`,
      data
    );
  }

  override deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/${id}/`
    );
  }

  override actualizar(id: number, data: Partial<Institucion>) {
    return this.http.put<{ mensaje: string; data: Institucion }>(
      `${this.apiUrl}/institucion-pais/${id}/`,
      data
    );
  }

  override habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-institucion/${id}/`,
      {}
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Institucion[]
  ): Institucion | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
