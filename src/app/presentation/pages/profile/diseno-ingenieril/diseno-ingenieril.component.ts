import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { DisenoIngenierilResponse } from '@interfaces/index';
import {
  AddDisenoIngenierilComponent,
  UpdateDisenoIngenierilComponent,
} from '@presentation/modals';
import {
  CommonService,
  ProfileService,
  ToastService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-diseno-ingenieril',
  imports: [
    AddDisenoIngenierilComponent,
    UpdateDisenoIngenierilComponent,
    PaginationComponent,
  ],
  templateUrl: './diseno-ingenieril.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DisenoIngenierilComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public disenoIngenierilList = signal<DisenoIngenierilResponse[]>([]);

  public disenoIngenierilSelected = signal<DisenoIngenierilResponse | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadDisenoIngenierilList();
  }

  private loadDisenoIngenierilList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadDisenoIngenierilFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.disenoIngenierilList.set(res.data || []);
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
    const formacion = this.disenoIngenierilList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.disenoIngenierilSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadDisenoIngenierilList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadDisenoIngenierilList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadDisenoIngenierilList();
  }

  onDelete(itemId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarDisenoIngenieril(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadDisenoIngenierilList();
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
