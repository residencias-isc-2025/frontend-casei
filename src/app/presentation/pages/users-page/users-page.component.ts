import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CreateUserComponent } from '@modals/index';
import {
  AdscripcionesService,
  ToastService,
  UsersService,
} from '@services/index';
import { AdscripcionData, UserResponse } from '@interfaces/index';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchParams } from '@interfaces/dtos/search-params.dto';

@Component({
  selector: 'app-users-page',
  imports: [
    CommonModule,
    CreateUserComponent,
    PaginationComponent,
    SearchBarComponent,
  ],
  templateUrl: './users-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public usersService = inject(UsersService);
  public adscripcionesService = inject(AdscripcionesService);

  public showModal = signal(false);

  public totalItems = signal(0);
  public users = signal<UserResponse[]>([]);
  public adscripcionesList = signal<AdscripcionData[]>([]);

  public currentPage = signal(1);

  public searchParams = signal<SearchParams | undefined>(undefined);

  ngOnInit(): void {
    this.searchParams.set({
      page: this.currentPage(),
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
    });

    this.adscripcionesService.loadAdscripciones();
    this.adscripcionesService.getAdscripcion().subscribe((lista) => {
      this.adscripcionesList.set(lista);
    });

    this.loadUsers();
  }

  private loadUsers(): void {
    this.usersService.getAllUsers(this.searchParams()!).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.items!);
          this.users.set(res.usuarios || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los usuarios.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  resetPassword(userId: number): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.usersService.resetPassword(token, userId).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
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

    const token = localStorage.getItem('casei_residencias_access_token') || '';

    const formData = new FormData();
    formData.append('archivo_csv', file);

    this.toastService.showInfo('Por favor espere...', 'Creando usuarios');

    this.usersService.createUsersByCsv(token, formData).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadUsers();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);

    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });

    this.loadUsers();
  }

  onDisableUser(userId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.usersService.disableUserFunction(userId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadUsers();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  onEnableUser(userId: number) {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.toastService.showInfo('Por favor espere...', 'Actualizando');

    this.usersService.enableUserFunction(userId, token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.toastService.showSuccess(res.mensaje!, 'Éxito');
          this.loadUsers();
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  filterUsersByNomina(searchTerm: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        nomina: searchTerm,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
  }

  filterUsersByName(searchTerm: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        nombre: searchTerm,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
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
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        area_adscripcion: areaId,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
  }

  filterUsersByEstado(estado: string) {
    this.searchParams.update((params) => {
      return {
        ...(params || {}),
        estado: estado,
        page: this.currentPage(),
        accessToken:
          localStorage.getItem('casei_residencias_access_token') || '',
      };
    });
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

    this.searchParams.set({
      page: this.currentPage(), // Reiniciar la paginación a la primera página
      accessToken: localStorage.getItem('casei_residencias_access_token') || '',
      nomina: '',
      nombre: '',
      area_adscripcion: '',
      estado: '',
    });

    setTimeout(() => {
      this.loadUsers();
    }, 100);
  }

  cleanRole(user: UserResponse): string {
    const role = user.role;
    return role === 'superuser'
      ? 'Super usuario'
      : role === 'admin'
      ? 'Administrador'
      : 'Docente';
  }
}
