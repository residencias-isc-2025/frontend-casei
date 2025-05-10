import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

export type FilterType = 'text' | 'select' | 'boolean' | 'date';

export interface FilterConfig {
  key: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: any }[];
}

@Component({
  selector: 'app-filter-bar',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent implements OnInit {
  fb = inject(FormBuilder);

  filters = input<FilterConfig[]>([]);

  search = output<Record<string, any>>();
  clear = output<void>();

  form = this.fb.group({});

  ngOnInit(): void {
    for (const filter of this.filters()) {
      this.form.addControl(filter.key, this.fb.control(null));
    }
  }

  onSearch() {
    this.search.emit(this.form.value);
  }

  onClear() {
    this.form.reset();
    this.clear.emit();
  }
}
