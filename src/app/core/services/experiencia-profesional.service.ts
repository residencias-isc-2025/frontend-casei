import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BaseService } from '@core/classes/base-service.class';
import { ExperienciaProfesional } from '@core/models/experiencia-profesional.model';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaProfesionalService extends BaseService<ExperienciaProfesional> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/experiencia_profesional`;

  override obtenerDatosPaginados(
    page: number,
    limit: number,
    params: any
  ): Observable<{
    count: number;
    next: string | null;
    previous: string | null;
    results: ExperienciaProfesional[];
  }> {
    return this.http.get<{
      count: number;
      next: string | null;
      previous: string | null;
      results: ExperienciaProfesional[];
    }>(
      `${this.apiUrl}/experiencia-profesional-no-academica/?page=${page}&page_size=${limit}`
    );
  }

  override crear(
    data: Partial<ExperienciaProfesional>
  ): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-profesional-no-academica/`,
      data
    );
  }

  override deshabilitar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-profesional-no-academica/${id}/`
    );
  }

  override habilitar(id: number): Observable<{ mensaje: string }> {
    throw new Error('Method not implemented.');
  }

  override actualizar(
    id: number,
    data: Partial<ExperienciaProfesional>
  ): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(
      `${this.apiUrl}/experiencia-profesional-no-academica/${id}/`,
      data
    );
  }

  override obtenerDataInfo(
    id: number,
    lista: ExperienciaProfesional[]
  ): ExperienciaProfesional | undefined {
    const data = lista.find((d) => d.id === id);
    return data;
  }
}
