import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormacionAcademicaData } from '@interfaces/index';
import { ProfileService, ToastService } from '@services/index';

@Component({
  selector: 'app-formacion-academica',
  imports: [],
  templateUrl: './formacion-academica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FormacionAcademicaComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public formacionAcademicaList = signal<FormacionAcademicaData[]>([]);

  ngOnInit(): void {
    this.loadFormacionAcademica();
  }

  private loadFormacionAcademica(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadFormacionAcademica(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.formacionAcademicaList.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la formación académica.',
            'Hubo un problema'
          );
        }
      },
    });
  }
}
