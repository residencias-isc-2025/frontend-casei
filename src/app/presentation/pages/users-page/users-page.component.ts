import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { AdscripcionesService, ToastService } from '@services/index';
import { AdscripcionData } from '@interfaces/index';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { UserService } from '@core/services/user.service';
import { User } from '@core/models/user.model';
import { UserFormComponent } from '@presentation/forms/user-form/user-form.component';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    UserFormComponent,
    PaginationComponent,
    SearchBarComponent,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersPageComponent implements OnInit {
  toastService = inject(ToastService);
  userService = inject(UserService);
  adscripcionesService = inject(AdscripcionesService);

  showModal = signal(false);
  totalItems = signal(0);
  users = signal<User[]>([]);
  adscripcionesList = signal<AdscripcionData[]>([]);
  currentPage = signal(1);

  filterNomina = signal<string>('');
  filterName = signal<string>('');
  filterArea = signal<string>('');
  filterEstado = signal<string>('');

  ngOnInit(): void {
    this.adscripcionesService.loadAdscripciones();
    this.adscripcionesService.getAdscripcion().subscribe((lista) => {
      this.adscripcionesList.set(lista);
    });

    this.loadUsers();
  }

  private loadUsers(): void {
    this.userService
      .obtenerUsuariosPaginados(this.currentPage(), 10, {
        nomina: this.filterNomina(),
        area: this.filterArea(),
        estado: this.filterEstado(),
        nombre: this.filterName(),
      })
      .subscribe({
        next: (response) => {
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

    this.userService.deshabilitarUsuario(userId).subscribe({
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

    this.userService.habilitarUsuario(userId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.toastService.showSuccess(res.mensaje!, 'Éxito');
        this.loadUsers();
      },
    });
  }

  filterUsersByNomina(searchTerm: string) {
    this.filterNomina.set(searchTerm);
  }

  filterUsersByName(searchTerm: string) {
    this.filterName.set(searchTerm);
  }

  handleSelectAreaChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterUsersByArea(select.value ?? '');
  }

  handleSelectEstadoChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.filterUsersByEstado(select.value ?? '');
  }

  filterUsersByArea(areaId: string) {
    this.filterArea.set(areaId);
  }

  filterUsersByEstado(estado: string) {
    this.filterEstado.set(estado);
  }

  searchWithFilters() {
    this.loadUsers();
  }

  clearAllFilters(
    searchByNomina: any,
    searchByName: any,
    selectArea: HTMLSelectElement,
    selectEstado: HTMLSelectElement
  ) {
    searchByNomina.clearSearch();
    searchByName.clearSearch();

    selectArea.selectedIndex = 0;
    selectEstado.selectedIndex = 0;

    this.filterNomina.set('');
    this.filterName.set('');
    this.filterArea.set('');
    this.filterEstado.set('');

    setTimeout(() => {
      this.loadUsers();
    }, 100);
  }

  cleanRole(user: User): string {
    return this.userService.limpiarRol(user);
  }
}
