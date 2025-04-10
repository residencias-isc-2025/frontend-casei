import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { SubTemas } from '@core/models/sub-temas.model';
import { Tema } from '@core/models/tema.model';
import { SubTemaService } from '@core/services/sub-tema.service';
import { TemaService } from '@core/services/tema.service';
import { ToastService } from '@core/services/toast.service';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-subtemas-tema-form',
  imports: [ConfirmationModalComponent],
  templateUrl: './subtemas-tema-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtemasTemaFormComponent implements OnInit {
  onCancel = output();
  onSave = output();

  toastService = inject(ToastService);
  temaService = inject(TemaService);
  subtemaService = inject(SubTemaService);

  tema = input.required<Tema>();

  subtemas = signal<SubTemas[]>([]);

  showDeleteModal = signal(false);
  subtemaSelected = signal<SubTemas | null>(null);

  ngOnInit(): void {
    this.subtemaService
      .obtenerDatosPaginados(1, 100, {})
      .subscribe((res) => this.subtemas.set(res.results));
  }

  getSubtemaInfo(idSubtema: number) {
    return this.subtemaService.getSubtemaData(idSubtema, this.subtemas());
  }

  onShowDeleteModal(subtema: SubTemas) {
    this.subtemaSelected.set(subtema);
    this.showDeleteModal.set(true);
  }

  onDelete(idSubtema: number) {
    const newSubtemas = this.tema().sub_temas.filter(
      (subtemaId) => subtemaId !== idSubtema
    );

    const payload: Partial<Tema> = {
      sub_temas: newSubtemas,
    };

    this.temaService.actualizar(this.tema()!.id, payload).subscribe({
      next: (response) => {
        this.toastService.showSuccess(response.mensaje, 'Éxito');
        this.onSave.emit();
      },
      error: (response) => {
        this.toastService.showError(response.mensaje, 'Malas noticias');
      },
    });
  }
}
