import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CurriculumVitaeResponse, InstitucionData } from '@interfaces/index';
import { DownloadPdfButtonComponent } from '@presentation/components/download-pdf-button/download-pdf-button.component';
import { DownloadXlsButtonComponent } from '@presentation/components/download-xls-button/download-xls-button.component';
import {
  CommonService,
  InstitucionesService,
  PdfService,
  ToastService,
} from '@presentation/services';
import { ReportsService } from '@presentation/services/reports.service';

@Component({
  selector: 'app-formats-page',
  imports: [DownloadPdfButtonComponent, DownloadXlsButtonComponent],
  templateUrl: './formats-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsPageComponent implements OnInit {
  pdfService = inject(PdfService);
  reportsService = inject(ReportsService);
  toastService = inject(ToastService);
  commonService = inject(CommonService);
  institucionesService = inject(InstitucionesService);

  curriculumVitaeData = signal<CurriculumVitaeResponse | null>(null);
  institucionesList = signal<InstitucionData[]>([]);

  ngOnInit(): void {
    this.institucionesService.loadInstituciones();
    this.institucionesService.getInstituciones().subscribe((lista) => {
      this.institucionesList.set(lista);
    });
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
