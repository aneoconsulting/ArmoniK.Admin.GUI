import { Component, EventEmitter, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent
  implements ClrDatagridFilterInterface<Date | null>
{
  @Input() name = '';
  @Input() property = '';

  selectedDate: Date | null = null;

  changes = new EventEmitter<boolean>(false);

  onDateSelected(date: Date) {
    this.selectedDate = date;
    this.changes.emit(true);
  }

  get value() {
    // format date to YYYY-MM-DD
    // set UTC to 0 to avoid timezone issues
    if (this.selectedDate) {
      const date = new Date(
        Date.UTC(
          this.selectedDate.getFullYear(),
          this.selectedDate.getMonth(),
          this.selectedDate.getDate()
        )
      );
      return date.toISOString().split('T')[0];
    }
    return null;
  }

  /**
   * Unused but required by the interface
   */
  accepts(_: unknown): boolean {
    return false;
  }

  /**
   * Verify if the filter is active
   */
  isActive(): boolean {
    return !!this.selectedDate;
  }
}
