import { Component, EventEmitter, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-session-date-filter',
  templateUrl: './session-date-filter.component.html',
  styleUrls: ['./session-date-filter.component.scss'],
})
export class SessionDateFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  changes = new EventEmitter<boolean>(false);
  @Input() name: string;
  @Input() date: Date | null;

  get property(): string {
    return this.name;
  }

  get value(): string | undefined {
    return this.date?.toJSON();
  }

  onChange() {
    this.changes.emit(true);
  }

  clear() {
    this.date = null;
    this.changes.emit(false);
  }

  accepts(): boolean {
    return true;
  }

  /**
   * Checks if the filter is active
   */
  isActive(): boolean {
    return !!this.date;
  }
}
