import { Component, EventEmitter, Input } from '@angular/core';
import { ClrDatagridFilterInterface } from '@clr/angular';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-id-filter',
  templateUrl: './id-filter.component.html',
  styleUrls: ['./id-filter.component.scss'],
})
export class IdFilterComponent implements ClrDatagridFilterInterface<string> {
  @Input() name = '';
  @Input() inputValue = '';

  inputChangeSubject = new Subject<string>();
  inputChange$ = this.inputChangeSubject
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe(() => {
      this.changes.emit(true);
    });

  changes = new EventEmitter<boolean>(false);

  get property() {
    return this.name;
  }

  get value() {
    return this.inputValue;
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
