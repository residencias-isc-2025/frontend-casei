import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { LogroProfesionalData } from '@interfaces/index';
import {
  AddLogroProfesionalComponent,
  UpdateLogroProfesionalComponent,
} from '@presentation/modals';
import {
  CommonService,
  ProfileService,
  ToastService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-logros-profesionales',
  imports: [
    AddLogroProfesionalComponent,
    UpdateLogroProfesionalComponent,
    PaginationComponent,
  ],
  templateUrl: './logros-profesionales.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LogrosProfesionalesComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public logrosProfesionalesList = signal<LogroProfesionalData[]>([]);
  public logroProfesionalSelected = signal<LogroProfesionalData | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadLogrosProfesionalesList();
  }

  private loadLogrosProfesionalesList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadLogrosProfesionalesFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.logrosProfesionalesList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudo obtener la actualización disciplinar.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.logrosProfesionalesList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.logroProfesionalSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadLogrosProfesionalesList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadLogrosProfesionalesList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadLogrosProfesionalesList();
  }

  onDelete(itemId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarLogroProfesional(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadLogrosProfesionalesList();
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
