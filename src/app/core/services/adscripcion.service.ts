import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Adscripcion } from '@core/models/adscripcion.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdscripcionService extends BaseService<Adscripcion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/adscripcion`;

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
      results: Adscripcion[];
    }>(`${this.apiUrl}/area-adscripcion/?${filters.toString()}`);
  }

  obtenerAdscripcionPorId(id: number) {
    return this.http.get<Adscripcion>(`${this.apiUrl}/area-adscripcion/${id}/`);
  }

  override crear(data: Partial<Adscripcion>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/area-adscripcion/`,
      data
    );
  }

  override deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/area-adscripcion/${id}/`
    );
  }

  override actualizar(id: number, data: Partial<Adscripcion>) {
    return this.http.put<{ mensaje: string; data: Adscripcion }>(
      `${this.apiUrl}/area-adscripcion/${id}/`,
      data
    );
  }

  override habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-area-adscripcion/${id}/`,
      {}
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Adscripcion[]
  ): Adscripcion | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  leerArchivoCsv(formData: FormData) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/area-adscripcion/carga-csv/`,
      formData
    );
  }
}
