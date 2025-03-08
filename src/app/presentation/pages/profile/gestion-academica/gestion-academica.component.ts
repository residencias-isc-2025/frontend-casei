import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  GestionAcademicaData,
  InstitucionData,
} from '@interfaces/index';
import {
  CommonService,
  ProfileService,
  ToastService,
  UsersService,
} from '@services/index';
import {
  AddGestionAcademicaComponent,
  UpdateGestionAcademicaComponent,
} from '@modals/index';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-gestion-academica',
  imports: [
    AddGestionAcademicaComponent,
    UpdateGestionAcademicaComponent,
    PaginationComponent,
  ],
  templateUrl: './gestion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionAcademicaComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public gestionAcademicaList = signal<GestionAcademicaData[]>([]);
  public institucionesList = signal<InstitucionData[]>([]);

  public gestionAcademicaSelected = signal<GestionAcademicaData | null>(
    null
  );

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadInstituciones();
    this.loadGestionAcademicaList();
  }

  private loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.getInstitucionesList(token, 1, 100).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.schools || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la formación académica.',
            'Hubo un problema'
          );
        }
      },
    });
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
              'No se pudo obtener la actualización disciplinar.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  getInstitucion(idInstitucion: number): string {
    const institucion = this.institucionesList().find(
      (institucion) => institucion.id === idInstitucion
    );

    return institucion ? institucion.nombre_institucion : '';
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.gestionAcademicaList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.gestionAcademicaSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
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
            'No se pudieron obtener las actualizaciones discilpinares.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
