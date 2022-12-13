import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClarityModule, ClrDatagridFilterInterface } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-id-filter',
  templateUrl: './id-filter.component.html',
  styleUrls: ['./id-filter.component.scss'],
  imports: [ClarityModule, TranslateModule, FormsModule, CommonModule],
})
export class IdFilterComponent
  implements ClrDatagridFilterInterface<string>, OnInit, OnDestroy
{
  @Output() changes = new EventEmitter<never>();

  @Input() name = '';
  @Input() inputValue = '';

  inputSubject = new Subject<string>();
  input: Subscription = new Subscription();

  get property() {
    return this.name;
  }

  get value() {
    return this.inputValue;
  }

  ngOnInit(): void {
    // The subscription permits us to prevent the string filter to reload at each input
    const input$ = this.inputSubject.asObservable();
    this.input = input$
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe(() => {
        this.changes.emit();
      });
  }

  ngOnDestroy(): void {
    this.input.unsubscribe();
  }

  onChange() {
    this.inputSubject.next(this.inputValue);
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
