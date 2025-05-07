import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { PerfilIngreso } from '@core/models/perfil-ingreso.mode';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PerfilIngresoService extends BaseService<PerfilIngreso> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/perfil_ingreso/perfil_ingreso`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: PerfilIngreso[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: PerfilIngreso[];
    }>(`${this.apiUrl}/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<PerfilIngreso>
  ): Observable<{ mensaje: string }> {
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
    data: Partial<PerfilIngreso>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string; data: PerfilIngreso }>(
      `${this.apiUrl}/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: PerfilIngreso[]
  ): PerfilIngreso | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
