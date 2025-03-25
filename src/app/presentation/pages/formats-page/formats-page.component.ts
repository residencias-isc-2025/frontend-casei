import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurriculumVitae } from '@core/models/curriculum-vitae.model';
import { Institucion } from '@core/models/institucion.model';
import { CedulaService } from '@core/services/cedula.service';
import { CommonService } from '@core/services/common.service';
import { InstitucionService } from '@core/services/institucion.service';
import { PdfService } from '@core/services/pdf.service';
import { ToastService } from '@core/services/toast.service';
import { DownloadPdfButtonComponent } from '@presentation/components/download-pdf-button/download-pdf-button.component';
import { DownloadXlsButtonComponent } from '@presentation/components/download-xls-button/download-xls-button.component';
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
  reportsService = inject(CedulaService);
  commonService = inject(CommonService);

  curriculumVitaeData = signal<CurriculumVitae | null>(null);
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
    this.reportsService.obtenerCurriculumVitae().subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.pdfService.generarCurriculumVitae(res, this.institucionesList());
      },
    });
  }

  downloadCurricumSintetico() {
    this.reportsService.obtenerCurriculumVitae().subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        this.pdfService.generarCurriculumSintetico(
          res,
          this.institucionesList()
        );
      },
    });
  }
}
