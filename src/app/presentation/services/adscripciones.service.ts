import { inject, Injectable } from '@angular/core';
import { AdscripcionData } from '@interfaces/index';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AdscripcionesService {
  private adscripcionesList = new BehaviorSubject<AdscripcionData[]>([]);

  public commonService = inject(CommonService);
  public toastService = inject(ToastService);

  loadAdscripciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .getAdscripcionesList({ accessToken: token, page: 1, pageSize: 100 })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.adscripcionesList.next(res.adscripciones || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las adscripciones.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  getAdscripcion(): Observable<AdscripcionData[]> {
    return this.adscripcionesList.asObservable();
  }

  getAdscripcioNombre(idAdscripcion: number): string {
    const adscripcion = this.adscripcionesList
      .getValue()
      .find((inst) => inst.id === idAdscripcion);
    return adscripcion ? adscripcion.nombre : '';
  }

  getAdscripcioSiglas(idAdscripcion: number): string {
    const adscripcion = this.adscripcionesList
      .getValue()
      .find((inst) => inst.id === idAdscripcion);
    return adscripcion ? adscripcion.siglas : '';
  }
}
