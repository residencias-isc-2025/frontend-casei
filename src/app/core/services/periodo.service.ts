import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Periodo } from '@core/models/periodo.model';
import { environment } from '@environments/environment';

export interface PeriodoSearchParams {
  clave?: string;
  activo?: number | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class PeriodoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/periodos`;

  // GET
  obtenerPeriodosPaginados(
    page: number,
    limit: number,
    params: PeriodoSearchParams
  ) {
    let url = `${this.apiUrl}/periodo/?page=${page}&page_size=${limit}`;

    if (params.clave !== '') url += `&clave=${params.clave}`;
    if (params.activo !== undefined) url += `&activo=${params.activo}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Periodo[];
    }>(url);
  }

  // POST
  crearPeriodo(data: Partial<Periodo>) {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/periodo/`, data);
  }

  // DELETE
  deshabilitarPeriodo(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/periodo/${id}/`
    );
  }

  // PUT
  habilitarPeriodo(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/activar-periodo/${id}/`,
      {}
    );
  }

  actualizarPeriodo(id: number, data: Partial<Periodo>) {
    return this.http.put<{ mensaje: string; data: Periodo }>(
      `${this.apiUrl}/periodo/${id}/`,
      data
    );
  }
}
