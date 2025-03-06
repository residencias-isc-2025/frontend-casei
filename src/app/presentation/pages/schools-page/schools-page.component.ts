import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CountriesResponse, InstitucionesResponse } from '@interfaces/index';
import { ToastService, CommonService } from '@presentation/services';
import { PaginationComponent } from '@components/pagination/pagination.component';
import { AddInstitucionComponent } from '@presentation/modals';

@Component({
  selector: 'app-schools-page',
  imports: [CommonModule, PaginationComponent, AddInstitucionComponent],
  templateUrl: './schools-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SchoolsPageComponent implements OnInit {
  public toastService = inject(ToastService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);

  public totalItems = signal(0);
  public schools = signal<InstitucionesResponse[]>([]);
  public countries = signal<CountriesResponse[]>([]);

  public currentPage = signal(1);

  ngOnInit(): void {
    //this.loadCountries();
    this.loadSchools();
  }

  private loadCountries(): void {
    this.commonService.loadCountries().subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.countries.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los países.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  private loadSchools(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.loadInstituciones(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.totalItems.set(res.data?.length!);
          this.schools.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener los usuarios.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    this.loadSchools();
  }

  onSaveEmit(): void {
    this.showAddModal.set(false);
    this.toastService.showInfo('Cargando instituciones', 'Por favor espere');
    this.loadSchools();
  }
}
