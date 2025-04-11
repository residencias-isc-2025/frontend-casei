import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { AtributoEgreso } from '@core/models/atributo-egreso.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AtributoEgresoService extends BaseService<AtributoEgreso> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/atributo_egreso`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: AtributoEgreso[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: AtributoEgreso[];
    }>(`${this.apiUrl}/atributos-egreso/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<AtributoEgreso>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/atributos-egreso/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/atributos-egreso/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<AtributoEgreso>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/atributos-egreso/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: AtributoEgreso[]
  ): AtributoEgreso | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
