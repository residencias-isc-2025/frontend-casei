import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Actividad } from '@core/models/actividad.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActividadService extends BaseService<Actividad> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/actividad`;
  private mediaUrl = environment.media_url;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any>
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Actividad[];
  }> {
    throw new Error('Method not implemented.');
  }

  obtenerActividadesClase(claseId: number): Observable<Actividad[]> {
    return this.http.get<Actividad[]>(
      `${this.apiUrl}/clase/${claseId}/actividades/`
    );
  }

  override crear(data: Partial<Actividad>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/actividad/`,
      data
    );
  }

  cargarArchivo(data: FormData): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/actividad/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<Actividad>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/actividad/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Actividad[]
  ): Actividad | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }

  actualizarActividad(
    id: number,
    data: FormData
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/actividad/${id}/`,
      data
    );
  }

  descargarArchivo(url: string) {
    const fullUrl = `${this.mediaUrl}${url}`;
    return this.http.get(fullUrl, { responseType: 'blob' });
  }
}
