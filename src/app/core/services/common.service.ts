import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Countries } from '@core/models/countries.model';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private http = inject(HttpClient);

  obtenerListaPaises() {
    return this.http.get<Countries[]>('https://restcountries.com/v3.1/all');
  }
}
