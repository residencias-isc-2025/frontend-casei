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
    data: Partial<AtributoEgreso>
  ): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  atributoEgresoSiglas(id: number, lista: AtributoEgreso[]) {
    const atributo = lista.find((atr) => atr.id === id);
    return atributo ? atributo.siglas : '';
  }

  atributoEgresoDescripcion(id: number, lista: AtributoEgreso[]) {
    const atributo = lista.find((atr) => atr.id === id);
    return atributo ? atributo.descripcion : '';
  }
}
