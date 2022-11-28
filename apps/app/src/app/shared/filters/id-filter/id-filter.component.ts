import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-id-filter',
  templateUrl: './id-filter.component.html',
  styleUrls: ['./id-filter.component.scss'],
})
export class IdFilterComponent
  implements ClrDatagridFilterInterface<string>, OnInit, OnDestroy
{
  @Input() name = '';
  @Input() inputValue = '';

  inputChangeSubject = new Subject<string>();
  inputChange: Subscription;

  changes = new EventEmitter<boolean>(false);

  get property() {
    return this.name;
  }

  get value() {
    return this.inputValue;
  }

  ngOnInit(): void {
    this.inputChange = this.inputChangeSubject
      .asObservable()
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe(() => {
        this.changes.emit(true);
      });
  }

  ngOnDestroy(): void {
    this.inputChange.unsubscribe();
  }

  onChange() {
    this.inputChangeSubject.next(this.inputValue);
  }

  clear() {
    this.inputValue = '';
    this.changes.emit(false);
  }

  isActive(): boolean {
    return this.inputValue.length != 0;
  }

  accepts(): boolean {
    return true;
  }
}
