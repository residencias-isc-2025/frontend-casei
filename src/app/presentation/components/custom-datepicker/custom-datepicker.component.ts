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

  daysOfWeek: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  monthNames: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
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

  changeMonth(direction: number) {
    let newMonth = this.currentMonth() + direction;
    let newYear = this.currentYear();

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    this.currentMonth.set(newMonth);
    this.currentYear.set(newYear);
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
