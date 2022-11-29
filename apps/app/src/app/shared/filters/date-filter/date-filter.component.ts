import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements ClrDatagridFilterInterface<string> {
  @Output() changes = new EventEmitter();

  @Input() name = '';
  @Input() beforeDate: Date | null = null;
  @Input() afterDate: Date | null = null;

  get property(): string {
    return this.name;
  }

  get value(): { before: number | null; after: number | null } {
    return {
      before: this.beforeDate ? this.beforeDate.getTime() / 1000 : null,
      after: this.afterDate ? this.afterDate.getTime() / 1000 : null,
    };
  }

  onDateChange() {
    this.changes.emit();
  }

  clear() {
    this.beforeDate = null;
    this.afterDate = null;
    this.changes.emit();
  }

  /**
   * Check if the filter is active
   */
  isActive(): boolean {
    return !!this.beforeDate || !!this.afterDate;
  }

  /**
   * Required by the interface
   */
  accepts(): boolean {
    return true;
  }
}
