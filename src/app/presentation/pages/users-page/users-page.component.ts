import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { Adscripcion } from '@core/models/adscripcion.model';
import { User } from '@core/models/user.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { ToastService } from '@core/services/toast.service';
import { UserService } from '@core/services/user.service';
import { CsvFileReaderComponent } from '@presentation/components/csv-file-reader/csv-file-reader.component';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';
import { LoaderComponent } from '@presentation/components/loader/loader.component';
import { UserFormComponent } from '@presentation/forms/user-form/user-form.component';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    UserFormComponent,
    PaginationComponent,
    FilterBarComponent,
    LoaderComponent,
    CsvFileReaderComponent,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersPageComponent implements OnInit {
  toastService = inject(ToastService);
  userService = inject(UserService);
  adscripcionService = inject(AdscripcionService);

  showModal = signal(false);
  showReadFileModal = signal(false);
  isLoading = signal(true);

  users = signal<User[]>([]);
  adscripcionesList = signal<Adscripcion[]>([]);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters = signal<FilterConfig[]>([
    { key: 'username', label: 'Nomina', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    {
      key: 'area_adscripcion',
      label: 'Area de adscripción',
      type: 'select',
      options: [],
    },
    {
      key: 'estado',
      label: 'Estado',
      type: 'boolean',
      options: [
        { label: 'Todos', value: '' },
        { label: 'Activo', value: 'activo' },
        { label: 'Inactivo', value: 'inactivo' },
      ],
    },
  ]);

  ngOnInit(): void {
    this.loadAdscripciones();
    this.loadUsers();
  }

  private loadAdscripciones() {
    this.adscripcionService
      .obtenerDatosPaginados(1, 100, {
        nombre: '',
        siglas: '',
        estado: 'activo',
      })
      .subscribe({
        next: (response) => {
          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay áreas de adscripción registradas',
              'Advertencia'
            );
            this.isLoading.set(false);
            return;
          }

          this.adscripcionesList.set(response.results);

          const adscripcionesOptions = response.results.map((a) => ({
            label: a.nombre,
            value: a.id,
          }));

          adscripcionesOptions.unshift({ label: 'Todas', value: -1 });

          this.filters.update((filtros) => {
            const updated = [...filtros];
            const index = updated.findIndex(
              (f) => f.key === 'area_adscripcion'
            );
            if (index !== -1) {
              updated[index] = {
                ...updated[index],
                options: adscripcionesOptions,
              };
            }
            return updated;
          });

          this.isLoading.set(false);
        },
      });
  }

  private loadUsers(): void {
    this.userService
      .obtenerDatosPaginados(this.currentPage(), 10, this.recordFilters())
      .subscribe({
        next: (response) => {
          if (response.count === 0) this.currentPage.set(0);
          this.totalItems.set(response.count);
          this.users.set(response.results);
          this.isLoading.set(false);
        },
        error: () => {
          this.toastService.showError(
            'Error al obtener usuarios.',
            'Malas noticias'
          );
          this.isLoading.set(false);
        },
      });
  }

  resetPassword(userId: number): void {
    this.userService.reestablecerPassword(userId).subscribe({
      next: (response) =>
        this.toastService.showSuccess(response.mensaje, 'Éxito'),
      error: (response) =>
        this.toastService.showSuccess(response.mensaje, 'Malas noticias'),
    });
  }

  onSaveEmit(): void {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.showModal.set(false);
    this.toastService.showInfo('Cargando usuarios', 'Por favor espere');
    this.loadUsers();
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadUsers();
  }

  onDisableUser(userId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.userService.deshabilitar(userId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadUsers();
      },
    });
  }

  onEnableUser(userId: number) {
    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.userService.habilitar(userId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadUsers();
      },
    });
  }

  onSearch(filters: Record<string, any>) {
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.recordFilters.set(filters);
    this.loadUsers();
  }

  onReadFile() {
    this.isLoading.set(true);
    this.showReadFileModal.set(false);
    if (this.currentPage() === 0) this.currentPage.set(1);
    this.loadUsers();
  }

  cleanRole(user: User): string {
    return this.userService.limpiarRol(user.role);
  }

  getSiglas(idArea: number) {
    return this.adscripcionService.obtenerDataInfo(
      idArea,
      this.adscripcionesList()
    )?.siglas;
  }
}
