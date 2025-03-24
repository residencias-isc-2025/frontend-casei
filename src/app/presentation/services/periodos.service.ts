import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PeriodoData } from '@interfaces/use-cases/periodo.response';
import { ToastService } from '../../core/services/toast.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class PeriodosService {
  private periodosList = new BehaviorSubject<PeriodoData[]>([]);

  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  loadPeriodos(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .getPeriodosList({
        accessToken: token,
        page: 1,
        pageSize: 100,
        activo: true,
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.periodosList.next(res.periodos || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener los periodos.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  getPeriodos(): Observable<PeriodoData[]>{
    return this.periodosList.asObservable();
  }
}
