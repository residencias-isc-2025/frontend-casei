import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { EstrategiaEnsenanza } from '@core/models/estrategia-ensenanza.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstrategiaEnsenanzaService extends BaseService<EstrategiaEnsenanza> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/estrategia_ensenanza`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: EstrategiaEnsenanza[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: EstrategiaEnsenanza[];
    }>(`${this.apiUrl}/estrategias-ensenanza/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<EstrategiaEnsenanza>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/estrategias-ensenanza/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/estrategias-ensenanza/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<EstrategiaEnsenanza>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/estrategias-ensenanza/${id}/`,
      data
    );
  }
}
