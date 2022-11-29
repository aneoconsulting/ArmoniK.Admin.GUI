import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
  @Output() changes = new EventEmitter();

  @Input() name = '';
  @Input() inputValue = '';

  inputChangeSubject = new Subject<string>();
  inputChange: Subscription;

  get property() {
    return this.name;
  }

  get value() {
    return this.inputValue;
  }

  ngOnInit(): void {
    // The subscription permits us to prevent the string filter to reload at each input
    this.inputChange = this.inputChangeSubject
      .asObservable()
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe(() => {
        this.changes.emit();
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
    this.changes.emit();
  }

  isActive(): boolean {
    return this.inputValue.length != 0;
  }

  /**
   * Required by the interface
   */
  accepts(): boolean {
    return true;
  }
}
