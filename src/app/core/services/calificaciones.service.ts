import { Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Calificacion } from '@core/models/calificacion.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CalificacionesService extends BaseService<Calificacion> {
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
    throw new Error('Method not implemented.');
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
    throw new Error('Method not implemented.');
  }

  override obtenerDataInfo(
    id: number,
    lista: Calificacion[]
  ): Calificacion | undefined {
    throw new Error('Method not implemented.');
  }
}
