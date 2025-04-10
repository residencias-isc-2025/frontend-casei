import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { SubTemas } from '@core/models/sub-temas.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubTemaService extends BaseService<SubTemas> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/sub_temas/sub-temas`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: SubTemas[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: SubTemas[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<SubTemas>): Observable<{ mensaje: string }> {
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
    data: Partial<SubTemas>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.apiUrl}/${id}/`, data);
  }

  getSubtemaData(id: number, lista: SubTemas[]) {
    const subtema = lista.find((s) => s.id === id);
    return subtema;
  }
}
