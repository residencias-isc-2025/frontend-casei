import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ActualizacionDisciplinarData } from '@interfaces/index';

import {
  AddActualizacionDisciplinarComponent,
  ConfirmationModalComponent,
  UpdateActualizacionDisciplinarComponent,
} from '@modals/index';

import {
  ToastService,
  ProfileService,
  CommonService,
  UsersService,
} from '@services/index';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { InstitucionService } from '@core/services/institucion.service';
import { tap } from 'rxjs';
import { Institucion } from '@core/models/institucion.model';

@Component({
  selector: 'app-actualizacion-disciplinar',
  imports: [
    AddActualizacionDisciplinarComponent,
    UpdateActualizacionDisciplinarComponent,
    ConfirmationModalComponent,
    PaginationComponent,
  ],
  templateUrl: './actualizacion-disciplinar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ActualizacionDisciplinarComponent {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);

  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public totalItems = signal(0);
  public actualizacionDisciplinarList = signal<ActualizacionDisciplinarData[]>(
    []
  );
  public institucionesList = signal<Institucion[]>([]);

  public currentPage = signal(1);
  public actualizacionDisciplinarSelected =
    signal<ActualizacionDisciplinarData | null>(null);

  ngOnInit(): void {
    this.institucionService
      .obtenerInstitucionesPaginadas(1, 100, {
        estado: 'activo',
      })
      .pipe(
        tap((res) => {
          this.institucionesList.set(res.results);
        })
      )
      .subscribe();
    this.loadActualizacionDisciplinarList();
  }

  private loadActualizacionDisciplinarList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadActualizacionDisciplinarFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.actualizacionDisciplinarList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las actualizaciones disciplinares.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadActualizacionDisciplinarList();
  }

  onShowUpdateModal(actualizacionDisciplinar: ActualizacionDisciplinarData) {
    this.actualizacionDisciplinarSelected.set(actualizacionDisciplinar);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(actualizacionDisciplinar: ActualizacionDisciplinarData) {
    this.actualizacionDisciplinarSelected.set(actualizacionDisciplinar);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadActualizacionDisciplinarList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadActualizacionDisciplinarList();
    this.showUpdateModal.set(false);
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarActualizacionDisciplinar(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadActualizacionDisciplinarList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las actualizaciones discilpinares.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
