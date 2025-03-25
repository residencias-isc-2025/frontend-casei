import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { ProductoAcademico } from '@core/models/productos-academicos.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoAcademicoService extends BaseService<ProductoAcademico> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/productos_academicos`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ProductoAcademico[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ProductoAcademico[];
    }>(`${this.apiUrl}/productos-academicos/?page=${page}&page_size=${limit}`);
  }

  override crear(
    data: Partial<ProductoAcademico>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/premios/`, data);
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/productos-academicos/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<ProductoAcademico>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/productos-academicos/${id}/`,
      data
    );
  }
}
