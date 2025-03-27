import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Tema } from '@core/models/tema.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemaService extends BaseService<Tema> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/temas`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Tema[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Tema[];
    }>(`${this.apiUrl}/temas/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<Tema>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/temas/`, data);
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.apiUrl}/temas/${id}/`);
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<Tema>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/temas/${id}/`,
      data
    );
  }
}
