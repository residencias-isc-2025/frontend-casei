import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Institucion } from '@core/models/institucion.model';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface InstitucionSearchParams {
  nombre?: string;
  pais?: string;
  estado?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InstitucionService extends BaseService<Institucion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/institucion`;

  // GET
  obtenerDatosPaginados(
    page: number,
    limit: number,
    params: InstitucionSearchParams
  ) {
    let url = `${this.apiUrl}/institucion-pais/?page=${page}&page_size=${limit}`;

    if (params.nombre !== '') url += `&institucion=${params.nombre}`;
    if (params.pais !== '') url += `&pais=${params.pais}`;
    if (params.estado !== '') url += `&estado=${params.estado}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Institucion[];
    }>(url);
  }

  // POST
  crear(data: Partial<Institucion>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/`,
      data
    );
  }

  // DELETE
  deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/${id}/`
    );
  }

  // PUT
  actualizar(id: number, data: Partial<Institucion>) {
    return this.http.put<{ mensaje: string; data: Institucion }>(
      `${this.apiUrl}/institucion-pais/${id}/`,
      data
    );
  }

  habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-institucion/${id}/`,
      {}
    );
  }

  // OTROS
  getInstitucion(idInstitucion: number, lista: Institucion[]): string {
    const institucion = lista.find((inst) => inst.id === idInstitucion);
    return institucion ? institucion.nombre_institucion : '';
  }
}
