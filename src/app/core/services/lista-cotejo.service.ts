import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { ListaCotejo } from '@core/models/lista-cotejo.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ListaCotejoService extends BaseService<ListaCotejo> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/lista_cotejo/lista-cotejo`;
  private mediaUrl = environment.media_url;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ListaCotejo[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ListaCotejo[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(data: Partial<ListaCotejo>): Observable<{ mensaje: string }> {
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
    data: Partial<ListaCotejo>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: ListaCotejo }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: ListaCotejo[]
  ): ListaCotejo | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  cargarArchivo(data: FormData): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/`, data);
  }

  actualizarArchivo(
    id: number,
    data: FormData
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: ListaCotejo }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  descargarArchivo(url: string) {
    const fullUrl = `${this.mediaUrl}${url}`;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
}
