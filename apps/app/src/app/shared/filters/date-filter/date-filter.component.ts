import { Component, EventEmitter, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements ClrDatagridFilterInterface<string> {
  changes = new EventEmitter<boolean>(false);

  @Input() name = '';
  @Input() beforeDate: Date | null = null;
  @Input() afterDate: Date | null = null;

  get property(): string {
    return this.name;
  }

  get value(): string {
    return JSON.stringify({
      before: this.beforeDate ? this.beforeDate.getTime() : null,
      after: this.afterDate ? this.afterDate.getTime() : null,
    });
  }

  onDateChange() {
    this.changes.emit(true);
  }

  clear() {
    this.beforeDate = null;
    this.afterDate = null;
    this.changes.emit(false);
  }

  accepts(): boolean {
    return true;
  }

  /**
   * Check if the filter is active
   */
  isActive(): boolean {
    return !!this.beforeDate || !!this.afterDate;
  }
}
