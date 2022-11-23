import { Component, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-session-date-filter',
  templateUrl: './session-date-filter.component.html',
  styleUrls: ['./session-date-filter.component.scss'],
})
export class SessionDateFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  @Input() changes = new Subject<string>();
  date: Date;

  sendDate() {
    if (this.date) {
      this.changes.next(this.date.toJSON());
    } else {
      this.changes.next('');
    }
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
