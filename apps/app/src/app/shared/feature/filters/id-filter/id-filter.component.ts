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
  imports: [ClarityModule, FormsModule, CommonModule],
})
export class IdFilterComponent
  implements ClrDatagridFilterInterface<string>, OnInit, OnDestroy
{
  @Output() changes = new EventEmitter<never>();

  @Input() name = '';
  @Input() inputValue: string | null = '';

  public input = new Subject<string>();
  private _input$ = this.input.asObservable();
  subscription: Subscription | null = null;

  get property() {
    return this.name;
  }

  get value() {
    return this.inputValue;
  }

  ngOnInit(): void {
    // The subscription permits us to prevent the string filter to reload at each input
    this.subscription = this._input$
      .pipe(debounceTime(700), distinctUntilChanged())
      .subscribe(() => {
        this.changes.emit();
      });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.inputValue = null;
  }

  onChange() {
    this.input.next(this.inputValue ?? '');
  }

  clear() {
    this.inputValue = '';
    this.changes.emit();
  }

  reset() {
    this.inputValue = null;
  }

  isActive(): boolean {
    return !!this.inputValue && this.inputValue.length != 0;
  }

  /**
   * Required by the interface
   */
  accepts(): boolean {
    return true;
  }
}
