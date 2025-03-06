import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  totalItems = input<number>(0);
  currentPage = input<number>(1);
  itemsPerPage = input<number>(10);

  pageChanged = output<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems() / this.itemsPerPage());
  }

  get isFirstPage(): boolean {
    return this.currentPage() === 1;
  }

  get isLastPage(): boolean {
    return this.currentPage() === this.totalPages;
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;

    this.pageChanged.emit(page);
  }

  nextPage(): void {
    if (!this.isLastPage) {
      this.changePage(this.currentPage() + 1);
    }
  }

  prevPage(): void {
    if (!this.isFirstPage) {
      this.changePage(this.currentPage() - 1);
    }
  }

  firstPage(): void {
    this.changePage(1);
  }

  lastPage(): void {
    this.changePage(this.totalPages);
  }
}
