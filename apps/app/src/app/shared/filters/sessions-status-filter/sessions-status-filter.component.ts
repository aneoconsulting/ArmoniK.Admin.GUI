import { Component, Input } from '@angular/core';
import { SessionStatus } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sessions-status-filter',
  templateUrl: './sessions-status-filter.component.html',
  styleUrls: ['./sessions-status-filter.component.scss'],
})
export class SessionsStatusFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  selection: string[];

  @Input() changes = new Subject<string[]>();

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

  onSelectionChange(items: string[]): void {
    this.selection = items;
    if (items) {
      this.changes.next(items);
    } else {
      this.changes.next([]);
    }
  }

  accepts(): boolean {
    return true;
  }

  /**
   * Checks if the filter is active.
   */
  isActive(): boolean {
    return !!this.selection;
  }
}
