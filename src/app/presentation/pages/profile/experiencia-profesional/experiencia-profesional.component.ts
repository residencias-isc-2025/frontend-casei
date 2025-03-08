import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ExperienciaProfesionalData } from '@interfaces/index';
import {
  AddExperienciaProfesionalComponent,
  UpdateExperienciaProfesionalComponent,
} from '@presentation/modals';
import {
  ToastService,
  ProfileService,
  CommonService,
  UsersService,
} from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';

@Component({
  selector: 'app-experiencia-profesional',
  imports: [
    AddExperienciaProfesionalComponent,
    UpdateExperienciaProfesionalComponent,
    PaginationComponent,
  ],
  templateUrl: './experiencia-profesional.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ExperienciaProfesionalComponent {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);
  public usersService = inject(UsersService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public experienciaProfesionalList = signal<ExperienciaProfesionalData[]>([]);

  public experienciaProfesionalSelected =
    signal<ExperienciaProfesionalData | null>(null);

  public totalItems = signal(0);
  public currentPage = signal(1);

  ngOnInit(): void {
    this.loadExperienciaProfesionalList();
  }

  private loadExperienciaProfesionalList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService
      .loadExperienciaProfesionalFunction(token, this.currentPage())
      .subscribe({
        error: (res) => {
          this.toastService.showError(res.mensaje!, 'Malas noticias');
        },
        next: (res) => {
          if (res.ok) {
            this.totalItems.set(res.items!);
            this.experienciaProfesionalList.set(res.data || []);
          } else {
            this.toastService.showWarning(
              'No se pudieron obtener las experiencias profesionales.',
              'Hubo un problema'
            );
          }
        },
      });
  }

  onShowUpdateModal(experienciaProfesional: ExperienciaProfesionalData) {
    this.experienciaProfesionalSelected.set(experienciaProfesional);
    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadExperienciaProfesionalList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadExperienciaProfesionalList();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadExperienciaProfesionalList();
  }

  onDelete(itemId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.borrarExperienciaProfesional(itemId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.loadExperienciaProfesionalList();
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las experiencias profesionales.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
