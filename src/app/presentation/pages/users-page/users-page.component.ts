import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { PaginationComponent } from '@components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { UserFormComponent } from '@presentation/forms/user-form/user-form.component';
import { Adscripcion } from '@core/models/adscripcion.model';
import { AdscripcionService } from '@core/services/adscripcion.service';
import { ToastService } from '@core/services/toast.service';
import {
  FilterBarComponent,
  FilterConfig,
} from '@presentation/components/filter-bar/filter-bar.component';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    UserFormComponent,
    PaginationComponent,
    FilterBarComponent,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersPageComponent implements OnInit {
  toastService = inject(ToastService);
  userService = inject(UserService);
  adscripcionService = inject(AdscripcionService);

  showModal = signal(false);

  users = signal<User[]>([]);
  adscripcionesList = signal<Adscripcion[]>([]);
  recordFilters = signal<Record<string, any>>({});

  totalItems = signal(0);
  currentPage = signal(1);

  filters: FilterConfig[] = [
    { key: 'username', label: 'Nomina', type: 'text' },
    { key: 'nombre', label: 'Nombre', type: 'text' },
    { key: 'area_adscripcion', label: 'Area de adscripción', type: 'select' },
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
  ];

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
          this.adscripcionesList.set(response.results);

          if (response.results.length === 0) {
            this.toastService.showWarning(
              'No hay áreas de adscripción registradas',
              'Advertencia'
            );
          }
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
        },
        error: () => {
          this.toastService.showError(
            'Error al obtener usuarios.',
            'Malas noticias'
          );
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      this.toastService.showWarning(
        'No se seleccionó ningún archivo.',
        'Atención'
      );
      return;
    }

    const file = input.files[0];
    if (file.type !== 'text/csv') {
      this.toastService.showWarning(
        'El archivo debe ser de tipo CSV.',
        'Formato incorrecto'
      );
      return;
    }

    const formData = new FormData();
    formData.append('archivo_csv', file);

    this.toastService.showInfo('Por favor espere...', 'Creando usuarios');

    this.userService.crearUsuariosPorCsv(formData).subscribe({
      error: (response) => {
        this.toastService.showError(response.mensaje!, 'Malas noticias');
      },
      next: (response) => {
        this.toastService.showSuccess(response.mensaje!, 'Éxito');
        if (this.currentPage() === 0) this.currentPage.set(1);
        this.loadUsers();
      },
    });
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
