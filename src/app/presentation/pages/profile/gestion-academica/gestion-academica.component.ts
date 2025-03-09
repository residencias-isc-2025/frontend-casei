import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { GestionAcademicaData, InstitucionData } from '@interfaces/index';
import {
  CommonService,
  InstitucionesService,
  ProfileService,
  ToastService,
  UsersService,
} from '@services/index';
import {
  AddGestionAcademicaComponent,
  ConfirmationModalComponent,
  UpdateGestionAcademicaComponent,
} from '@modals/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-gestion-academica',
  imports: [
    AddGestionAcademicaComponent,
    UpdateGestionAcademicaComponent,
    PaginationComponent,
    ConfirmationModalComponent,
  ],
  templateUrl: './gestion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionAcademicaComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);
  public institucionesService = inject(InstitucionesService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);
  public showDeleteModal = signal(false);

  public gestionAcademicaList = signal<GestionAcademicaData[]>([]);
  public institucionesList = signal<InstitucionData[]>([]);

  public gestionAcademicaSelected = signal<GestionAcademicaData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.institucionesService.loadInstituciones();
    this.institucionesService.getInstituciones().subscribe((lista) => {
      this.institucionesList.set(lista);
    });
    this.loadGestionAcademicaList();
  }

  private loadGestionAcademicaList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadGestionAcademicaFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.gestionAcademicaList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las gestiones académicas.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(gestionAcademica: GestionAcademicaData) {
    this.gestionAcademicaSelected.set(gestionAcademica);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(gestionAcademica: GestionAcademicaData) {
    this.gestionAcademicaSelected.set(gestionAcademica);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    this.loadGestionAcademicaList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadGestionAcademicaList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadGestionAcademicaList();
  }

  onDelete(itemId: number) {
    this.showDeleteModal.set(false);

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarGestionAcademica(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadGestionAcademicaList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las gestiones académicas.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
