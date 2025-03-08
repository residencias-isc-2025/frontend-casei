import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  CurriculumVitaeResponse,
  InstitucionResponse,
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

  curriculumVitaeData = signal<CurriculumVitaeResponse | null>(null);
  institucionesList = signal<InstitucionResponse[]>([]);

  ngOnInit(): void {
    this.cargarInstituciones();
  }

  private cargarInstituciones(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.commonService.getInstitucionesList(token, 1, 100).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.institucionesList.set(res.schools || []);
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
}
