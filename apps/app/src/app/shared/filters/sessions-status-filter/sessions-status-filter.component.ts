import { Component, EventEmitter, Input } from '@angular/core';
import { SessionStatus } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridFilterInterface } from '@clr/angular';

@Component({
  selector: 'app-sessions-status-filter',
  templateUrl: './sessions-status-filter.component.html',
  styleUrls: ['./sessions-status-filter.component.scss'],
})
export class SessionsStatusFilterComponent
  implements ClrDatagridFilterInterface<number>
{
  @Input() selectedValue: number | null = null;

  @Input() name = '';

  sessionStatus = SessionStatus;
  // Retrieve all status type
  status = [
    ...Object.keys(SessionStatus)
      .filter((key) => !Number.isInteger(parseInt(key)))
      .map((key) => ({
        value: SessionStatus[key as keyof typeof SessionStatus],
        label: key,
      })),
  ];

  changes = new EventEmitter<boolean>(false);

  get property(): string {
    return this.name;
  }

  get value(): number | null {
    return this.selectedValue;
  }

  onSelectionChange(): void {
    this.changes.emit(true);
  }

  clear() {
    this.selectedValue = 0;
    this.changes.emit(false);
  }

  accepts(): boolean {
    return true;
  }

  /**
   * Checks if the filter is active.
   */
  isActive(): boolean {
    return !!this.selectedValue && this.selectedValue !== 0;
  }
}
