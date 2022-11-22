import { Component, Input } from '@angular/core';
import { SessionStatus } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-sessions-status-filter',
  templateUrl: './sessions-status-filter.component.html',
  styleUrls: ['./sessions-status-filter.component.scss'],
})
export class SessionsStatusFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  @Input() subjectSelection: Subject<string[]> = new Subject<string[]>();
  selection: string[] = [];

  changes: Observable<any>;

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
    this.subjectSelection.next(items);
  }

  accepts(): boolean {
    return true;
  }

  /**
   * Checks if the filter is active.
   */
  isActive(): boolean {
    return this.selection.length != 0;
  }
}
