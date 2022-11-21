import { Component, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-edited-at-filter',
  templateUrl: './edited-at-filter.component.html',
  styleUrls: ['./edited-at-filter.component.scss'],
})
export class EditedAtFilterComponent
  implements ClrDatagridFilterInterface<string>
{
  @Input() beforeDate$: Subject<string>;
  @Input() afterDate$: Subject<string>;

  beforeValue: Date;
  afterValue: Date;

  changes: Observable<any>;

  setBeforeValue(): void {
    if (this.beforeValue)
      this.beforeDate$.next((this.beforeValue.getTime() / 1000).toString());
    else this.beforeDate$.next('');
  }

  setAfterValue(): void {
    if (this.afterValue)
      this.afterDate$.next((this.afterValue.getTime() / 1000).toString());
    else this.afterDate$.next('');
  }

  accepts(): boolean {
    return true;
  }

  isActive(): boolean {
    return true;
  }
}
