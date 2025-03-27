import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { CriterioDesempenio } from '@core/models/criterio-desempenio.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CriterioDesempenioService extends BaseService<CriterioDesempenio> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/criterio_desempeno`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: CriterioDesempenio[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: CriterioDesempenio[];
    }>(`${this.apiUrl}/criterios-desempeno/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<CriterioDesempenio>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/criterios-desempeno/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/criterios-desempeno/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<CriterioDesempenio>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/criterios-desempeno/${id}/`,
      data
    );
  }

  criterioDesempenoData(id: number, lista: CriterioDesempenio[]) {
    const criterio = lista.find((criterioD) => criterioD.id === id);
    return criterio;
  }
}
