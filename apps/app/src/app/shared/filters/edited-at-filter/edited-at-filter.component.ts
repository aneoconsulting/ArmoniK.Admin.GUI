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

  beforeValue: string;
  afterValue: string;

  changes: Observable<any>;

  setBeforeValue(): void {
    this.beforeDate$.next(this.beforeValue);
  }

  setAfterValue(): void {
    this.afterDate$.next(this.afterValue);
  }

  accepts(): boolean {
    return true;
  }

  isActive(): boolean {
    return true;
  }
}
