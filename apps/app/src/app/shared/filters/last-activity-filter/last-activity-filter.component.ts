import { Component, EventEmitter, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-last-activity-filter',
  templateUrl: './last-activity-filter.component.html',
  styleUrls: ['./last-activity-filter.component.scss'],
})
export class LastActivityFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  @Input() name = '';
  @Input() defaultValue = 7;

  lastDays: number[] = [1, 3, 7, 15, 30, 60, 90, 180, 365];

  selectedValue: string | null =
    this.getDate(this.createDateSince(this.defaultValue)) ?? null;
  changes = new EventEmitter<boolean>(false);

  onChange(event: any) {
    this.selectedValue = event.target.value;
    this.changes.emit(true);
  }

  get value() {
    return this.selectedValue;
  }

  get property() {
    return this.name;
  }

  /**
   * Unused but required by the interface.
   */
  accepts() {
    return true;
  }

  /**
   * Verify if the filter is active.
   */
  isActive(): boolean {
    return !!this.selectedValue;
  }

  /**
   * Create a date in the past, subtracting the number of days from now.
   *
   * @param days Number of days to subtract from now
   *
   * @returns Date in the past
   */
  createDateSince(days: number): Date {
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  /**
   * Return a date, withouth the time.
   *
   * @param datetime to get the date from
   *
   * @returns Date without time
   */
  getDate(datetime: Date): string {
    return datetime.toISOString().split('T')[0];
  }
}
