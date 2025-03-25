import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CurriculumVitae } from '@core/models/curriculum-vitae.model';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CedulaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api_url}/reportes`;

  obtenerCurriculumVitae() {
    return this.http.get<CurriculumVitae>(`${this.apiUrl}/curriculum-vitae/`);
  }
}
