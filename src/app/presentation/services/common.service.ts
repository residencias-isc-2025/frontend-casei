import { Injectable } from '@angular/core';
import { obtenerListaPaisesUseCase } from '@core/index';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  getPaisesList() {
    return from(obtenerListaPaisesUseCase());
  }
}
