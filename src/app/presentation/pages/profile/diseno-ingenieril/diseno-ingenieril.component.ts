import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { DisenoIngenierilResponse } from '@interfaces/index';
import { AddDisenoIngenierilComponent, UpdateDisenoIngenierilComponent } from '@presentation/modals';
import { CommonService, ProfileService, ToastService } from '@presentation/services';

@Component({
  selector: 'app-diseno-ingenieril',
  imports: [AddDisenoIngenierilComponent, UpdateDisenoIngenierilComponent],
  templateUrl: './diseno-ingenieril.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DisenoIngenierilComponent implements OnInit {
  public toastService = inject(ToastService);
  public profileService = inject(ProfileService);
  public commonService = inject(CommonService);

  public showAddModal = signal(false);
  public showUpdateModal = signal(false);

  public disenoIngenierilList = signal<DisenoIngenierilResponse[]>([]);

  public disenoIngenierilSelected = signal<DisenoIngenierilResponse | null>(
    null
  );

  ngOnInit(): void {
    this.loadDisenoIngenierilList();
  }

  private loadDisenoIngenierilList(): void {
    const token = localStorage.getItem('casei_residencias_access_token') || '';

    this.profileService.loadDisenoIngenieril(token).subscribe({
      error: (res) => {
        this.toastService.showError(res.mensaje!, 'Malas noticias');
      },
      next: (res) => {
        if (res.ok) {
          this.disenoIngenierilList.set(res.data || []);
        } else {
          this.toastService.showWarning(
            'No se pudo obtener la actualización disciplinar.',
            'Hubo un problema'
          );
        }
      },
    });
  }

  onShowUpdateModel(idFormacion: number) {
    const formacion = this.disenoIngenierilList().find(
      (formacion) => formacion.id === idFormacion
    );

    this.disenoIngenierilSelected.set(
      formacion !== undefined ? formacion : null
    );

    this.showUpdateModal.set(true);
  }

  onSaveEmit() {
    this.loadDisenoIngenierilList();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    this.loadDisenoIngenierilList();
    this.showUpdateModal.set(false);
  }
}
