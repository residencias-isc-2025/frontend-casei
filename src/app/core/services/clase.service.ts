import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Clase } from '@core/models/clase.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClaseService extends BaseService<Clase> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/clase/clase`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any> = {}
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Clase[];
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
      results: Clase[];
    }>(`${this.apiUrl}/?${filters.toString()}`);
  }

  override crear(data: Partial<Clase>): Observable<{ mensaje: string }> {
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
    data: Partial<Clase>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: Clase }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(id: number, lista: Clase[]): Clase | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  obtenerItemById(id: number) {
    return this.http.get<Clase>(`${this.apiUrl}/${id}/`);
  }

  migrarClase(idClase: number, idPeriodo: number) {
    return this.http.post<Clase>(`${this.apiUrl}/migrar/`, {
      clase_id: idClase,
      periodo_id: idPeriodo,
    });
  }
}
