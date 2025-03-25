import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { PaginationComponent } from '@presentation/components/pagination/pagination.component';
import { ConfirmationModalComponent } from '@presentation/forms/confirmation-modal/confirmation-modal.component';
import { ToastService } from '@presentation/services';

@Component({
  selector: 'app-criterios-page',
  imports: [PaginationComponent, ConfirmationModalComponent],
  templateUrl: './criterios-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CriteriosPageComponent {
  toastService = inject(ToastService);

  showAddModal = signal(false);
  showUpdateModal = signal(false);
  showDeleteModal = signal(false);

  criteriosList = signal<any[]>([]);
  criterioSelected = signal<any | null>(null);

  totalItems = signal(0);
  currentPage = signal(1);

  ngOnInit(): void {
    //this.loadCriteriosDesempeno();
  }

  private loadCriteriosDesempeno(): void {}

  onShowUpdateModal(criterio: any) {
    this.criterioSelected.set(criterio);
    this.showUpdateModal.set(true);
  }

  onShowDeleteModal(criterio: any) {
    this.criterioSelected.set(criterio);
    this.showDeleteModal.set(true);
  }

  onSaveEmit() {
    //this.loadCriteriosDesempeno();
    this.showAddModal.set(false);
  }

  onEditEmit() {
    //this.loadCriteriosDesempeno();
    this.showUpdateModal.set(false);
  }

  onPageChanged(page: number): void {
    this.currentPage.set(page);
    //this.loadCriteriosDesempeno();
  }

  onDelete(itemId: number) {
    return;
  }
}
