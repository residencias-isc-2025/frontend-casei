import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
export class InstitucionService {
  private institucionesList = new BehaviorSubject<Institucion[]>([]);

  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/institucion`;

  // GET
  obtenerInstitucionesPaginadas(
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
  crearInstitucion(data: Partial<Institucion>) {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/`,
      data
    );
  }

  // DELETE
  deshabilitarInstitucion(id: number) {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/institucion-pais/${id}/`
    );
  }

  // PUT
  actualizarInstitucion(id: number, data: Partial<Institucion>) {
    return this.http.put<{ mensaje: string; data: Institucion }>(
      `${this.apiUrl}/institucion-pais/${id}/`,
      data
    );
  }

  habilitarInstitucion(id: number) {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/habilitar-institucion/${id}/`,
      {}
    );
  }

  // OTROS
  getInstituciones(): Observable<Institucion[]> {
    return this.institucionesList.asObservable();
  }

  getInstitucion(idInstitucion: number): string {
    const institucion = this.institucionesList
      .getValue()
      .find((inst) => inst.id === idInstitucion);
    return institucion ? institucion.nombre_institucion : '';
  }
}
