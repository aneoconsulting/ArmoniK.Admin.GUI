import { Component, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edited-at-filter',
  templateUrl: './edited-at-filter.component.html',
  styleUrls: ['./edited-at-filter.component.scss'],
})
export class EditedAtFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  @Input() changes = new Subject<{ property: string; value: string }>();

  beforeDate: Date;
  afterDate: Date;

  sendBeforeDate(): void {
    if (this.beforeDate) {
      this.changes.next({
        property: 'before',
        value: (this.beforeDate.getTime() / 1000).toString(),
      });
    } else {
      this.changes.next({ property: 'before', value: '' });
    }
  }

  sendAfterDate(): void {
    if (this.beforeDate) {
      this.changes.next({
        property: 'after',
        value: (this.beforeDate.getTime() / 1000).toString(),
      });
    } else {
      this.changes.next({ property: 'after', value: '' });
    }
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
