import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Calificacion } from '@core/models/calificacion.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalificacionesService extends BaseService<Calificacion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/calificaciones`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: Record<string, any>
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: Calificacion[];
  }> {
    throw new Error('Method not implemented.');
  }

  override crear(data: Partial<Calificacion>): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/calificaciones/`,
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
    data: Partial<Calificacion>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/calificaciones/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: Calificacion[]
  ): Calificacion | undefined {
    throw new Error('Method not implemented.');
  }

  obtenerCalificacionesClase(idClase: number): Observable<Calificacion[]> {
    return this.http.get<Calificacion[]>(
      `${this.apiUrl}/clase/${idClase}/calificaciones/`
    );
  }
}
