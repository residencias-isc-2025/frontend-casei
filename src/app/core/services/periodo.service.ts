import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Periodo } from '@core/models/periodo.model';
import { environment } from '@environments/environment';

export interface PeriodoSearchParams {
  clave?: string;
  activo?: number | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class PeriodoService extends BaseService<Periodo> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/periodos`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: PeriodoSearchParams
  ) {
    let url = `${this.apiUrl}/periodo/?page=${page}&page_size=${limit}`;

    if (params.clave !== undefined) url += `&clave=${params.clave}`;
    if (params.activo !== undefined) url += `&activo=${params.activo}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Periodo[];
    }>(url);
  }

  override crear(data: Partial<Periodo>) {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/periodo/`, data);
  }

  override deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/periodo/${id}/`
    );
  }

  override habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/activar-periodo/${id}/`,
      {}
    );
  }

  override actualizar(id: number, data: Partial<Periodo>) {
    return this.http.put<{ mensaje: string; data: Periodo }>(
      `${this.apiUrl}/periodo/${id}/`,
      data
    );
  }

  override obtenerDataInfo(id: number, lista: Periodo[]): Periodo | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
