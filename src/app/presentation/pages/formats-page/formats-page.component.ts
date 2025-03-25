import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Institucion } from '@core/models/institucion.model';
import { InstitucionService } from '@core/services/institucion.service';
import { CurriculumVitaeResponse } from '@interfaces/index';
import { DownloadPdfButtonComponent } from '@presentation/components/download-pdf-button/download-pdf-button.component';
import { DownloadXlsButtonComponent } from '@presentation/components/download-xls-button/download-xls-button.component';
import {
  CommonService,
  PdfService,
  ToastService,
} from '@presentation/services';
import { ReportsService } from '@presentation/services/reports.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-formats-page',
  imports: [DownloadPdfButtonComponent, DownloadXlsButtonComponent],
  templateUrl: './formats-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsPageComponent implements OnInit {
  toastService = inject(ToastService);
  institucionService = inject(InstitucionService);

  pdfService = inject(PdfService);
  reportsService = inject(ReportsService);
  commonService = inject(CommonService);

  curriculumVitaeData = signal<CurriculumVitaeResponse | null>(null);
  institucionesList = signal<Institucion[]>([]);

  ngOnInit(): void {
    this.institucionService
      .obtenerDatosPaginados(1, 100, {
        estado: 'activo',
      })
      .pipe(
        tap((res) => {
          this.institucionesList.set(res.results);
        })
      )
      .subscribe();
  }

  downloadCurricumVitae() {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.reportsService.getCurriculumVitaeFuncition(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.pdfService.generarCurriculumVitae(
            res.informacion!,
            this.institucionesList()
          );
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }

  downloadCurricumSintetico() {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.reportsService.getCurriculumVitaeFuncition(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.pdfService.generarCurriculumSintetico(
            res.informacion!,
            this.institucionesList()
          );
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }
}
