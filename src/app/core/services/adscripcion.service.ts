import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { Adscripcion } from '@core/models/adscripcion.model';
import { environment } from '@environments/environment';

export interface AdscripcionSearchParams {
  nombre?: string;
  estado?: string;
  siglas?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdscripcionService extends BaseService<Adscripcion> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/adscripcion`;

  // GET
  obtenerDatosPaginados(
    page: number,
    limit: number,
    params: AdscripcionSearchParams
  ) {
    let url = `${this.apiUrl}/area-adscripcion/?page=${page}&page_size=${limit}`;

    if (params.nombre !== '') url += `&nombre=${params.nombre}`;
    if (params.estado !== '') url += `&estado=${params.estado}`;
    if (params.siglas !== '') url += `&pais=${params.siglas}`;

    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: Adscripcion[];
    }>(url);
  }

  obtenerAdscripcionPorId(id: number) {
    return this.http.get<Adscripcion>(`${this.apiUrl}/area-adscripcion/${id}/`);
  }

  // POST
  crear(data: Partial<Adscripcion>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/area-adscripcion/`,
      data
    );
  }

  // DELETE
  deshabilitar(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/area-adscripcion/${id}/`
    );
  }

  // PUT
  actualizar(id: number, data: Partial<Adscripcion>) {
    return this.http.put<{ mensaje: string; data: Adscripcion }>(
      `${this.apiUrl}/area-adscripcion/${id}/`,
      data
    );
  }

  habilitar(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-area-adscripcion/${id}/`,
      {}
    );
  }

  // OTROS
  getAdscripcioNombre(idAdscripcion: number, lista: Adscripcion[]): string {
    const adscripcion = lista.find((ads) => ads.id === idAdscripcion);
    return adscripcion ? adscripcion.nombre : '';
  }

  getAdscripcioSiglas(idAdscripcion: number, lista: Adscripcion[]): string {
    const adscripcion = lista.find((inst) => inst.id === idAdscripcion);
    return adscripcion ? adscripcion.siglas : '';
  }
}
