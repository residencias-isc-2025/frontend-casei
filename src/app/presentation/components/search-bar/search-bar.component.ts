import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-search-bar',
  imports: [],
  templateUrl: './search-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
  placeholder = input('Buscar...');
  debounceTime = input(300);

  onSearch = output<string>();

  searchTerm = signal<string>('');

  private debouceTimeout: any;

  handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.onInputChange(input.value ?? '');
  }

  onInputChange(value: string) {
    clearTimeout(this.debouceTimeout);
    this.searchTerm.set(value);

    this.debouceTimeout = setTimeout(() => {
      this.onSearch.emit(this.searchTerm());
    }, this.debounceTime());
  }

  clearSearch() {
    this.searchTerm.set('');
    this.onSearch.emit('');
  }
}
