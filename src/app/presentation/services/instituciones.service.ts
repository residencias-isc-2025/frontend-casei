import { inject, Injectable, signal } from '@angular/core';
import { InstitucionData } from '@interfaces/index';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommonService } from './common.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class InstitucionesService {
  private institucionesList = new BehaviorSubject<InstitucionData[]>([]);

  public commonService = inject(CommonService);
  public toastService = inject(ToastService);

  loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService
      .getInstitucionesList({
        accessToken: token,
        page: 1,
        pageSize: 100,
        estado: 'activo',
      })
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.institucionesList.next(res.schools || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las instituciones.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  getInstituciones(): Observable<InstitucionData[]> {
    return this.institucionesList.asObservable();
  }

  getInstitucion(idInstitucion: number): string {
    const institucion = this.institucionesList
      .getValue()
      .find((inst) => inst.id === idInstitucion);
    return institucion ? institucion.nombre_institucion : '';
  }
}
