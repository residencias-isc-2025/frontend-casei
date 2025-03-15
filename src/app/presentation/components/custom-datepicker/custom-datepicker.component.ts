import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

interface MonthData {
  index: number;
  name: string;
}

@Component({
  selector: 'app-custom-datepicker',
  imports: [CommonModule, FormsModule],
  templateUrl: './custom-datepicker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDatepickerComponent implements OnInit {
  placeholder = input('Selecciona una fecha');
  selected = input<string | null>(null);

  dateSelected = output<string>();

  showDatePicker = signal(false);
  selectedDate = signal<string | null>(null);
  currentMonth = signal<number>(new Date().getMonth());
  currentYear = signal<number>(new Date().getFullYear());

  daysOfWeek: MonthData[] = [
    { index: 0, name: 'D' },
    { index: 1, name: 'L' },
    { index: 2, name: 'M' },
    { index: 3, name: 'X' },
    { index: 4, name: 'J' },
    { index: 5, name: 'V' },
    { index: 6, name: 'S' },
  ];

  monthNames: MonthData[] = [
    { index: 0, name: 'Enero' },
    { index: 1, name: 'Febrero' },
    { index: 2, name: 'Marzo' },
    { index: 3, name: 'Abril' },
    { index: 4, name: 'Mayo' },
    { index: 5, name: 'Junio' },
    { index: 6, name: 'Julio' },
    { index: 7, name: 'Agosto' },
    { index: 8, name: 'Septiembre' },
    { index: 9, name: 'Octubre' },
    { index: 10, name: 'Noviembre' },
    { index: 11, name: 'Diciembre' },
  ];

  ngOnInit(): void {
    this.selectedDate.set(this.selected());
    if (this.selected) {
      const date = new Date(this.selected()!);
      this.currentMonth.set(date.getMonth());
      this.currentYear.set(date.getFullYear());
    }
  }

  toggleDatePicker() {
    this.showDatePicker.update((prev) => !prev);
  }

  selectDate(date: string) {
    this.selectedDate.set(date);
    this.dateSelected.emit(date);
    this.toggleDatePicker();
  }

  onMonthChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentMonth.set(Number(selectElement.value));
  }

  onYearChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.currentYear.set(Number(selectElement.value));
  }

  generateYearOptions(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 100;
    return Array.from({ length: 101 }, (_, i) => startYear + i);
  }

  generateDays() {
    const days = [];
    const firstDayOfMonth = new Date(
      this.currentYear(),
      this.currentMonth(),
      1
    ).getDay();
    const daysInMonth = new Date(
      this.currentYear(),
      this.currentMonth() + 1,
      0
    ).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push('');
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        `${this.currentYear()}-${String(this.currentMonth() + 1).padStart(
          2,
          '0'
        )}-${String(day).padStart(2, '0')}`
      );
    }

    return days;
  }
}
