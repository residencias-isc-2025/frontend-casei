import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  CurriculumVitaeReponse,
  InstitucionesResponse,
} from '@interfaces/index';
import {
  CommonService,
  PdfService,
  ToastService,
} from '@presentation/services';
import { ReportsService } from '@presentation/services/reports.service';

@Component({
  selector: 'app-formats-page',
  imports: [],
  templateUrl: './formats-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormatsPageComponent implements OnInit {
  pdfService = inject(PdfService);
  reportsService = inject(ReportsService);
  toastService = inject(ToastService);
  commonService = inject(CommonService);

  curriculumVitaeData = signal<CurriculumVitaeReponse | null>(null);
  institucionesList = signal<InstitucionesResponse[]>([]);

  ngOnInit(): void {
    this.loadInstituciones();
  }

  private loadInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.loadInstituciones(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudieron obtener las instituciones.',
            'Hubo un problema'
          );
        }
      },
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
          this.pdfService.generateCurriculumVitae(res.informacion!, this.institucionesList());
        } else {
          this.toastService.showWarning(res.mensaje!, 'Malas noticias');
        }
      },
    });
  }
}
