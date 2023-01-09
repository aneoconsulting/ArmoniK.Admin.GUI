import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ClrDropdownModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

type Interval = {
  value: number;
  label: string;
};

export const DisabledIntervalValue = -1; // Use -1 to stop interval because 0 is a valid interval.

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-auto-refresh-dropdown',
  templateUrl: './auto-refresh-dropdown.component.html',
  styleUrls: ['./auto-refresh-dropdown.component.scss'],
  imports: [ClrDropdownModule, TranslateModule, NgIf, NgFor, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoRefreshDropdownComponent implements OnInit, OnDestroy {
  @Input() manualStop$ = new Observable<void>();
  @Output() refreshIntervalChange = new EventEmitter<number>();

  private _intervalsValues = [10_000, 30_000, 60_000, 120_000];
  private _initialIntervalValue = this._intervalsValues[0];
  private _disabledIntervalValue = DisabledIntervalValue;

  public intervals: Interval[] = this._intervalsValues.map((interval) => ({
    value: interval,
    label: this._formatInterval(interval),
  }));

  private _currentInterval = new BehaviorSubject<Interval>(this.intervals[0]);

  public currentInterval$ = this._currentInterval.asObservable();

  private _manualStopSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.refreshIntervalChange.emit(this._initialIntervalValue);

    this._manualStopSubscription = this.manualStop$.subscribe(() => {
      this._disableCurrentInterval();
    });
  }

  ngOnDestroy(): void {
    this._manualStopSubscription?.unsubscribe();
  }

  /**
   * Emit refresh interval.
   *
   * @param interval Interval in milliseconds
   */
  public onIntervalChange(interval: Interval): void {
    this._currentInterval.next(interval);
    this.refreshIntervalChange.emit(interval.value);
  }

  /**
   * Stop interval.
   */
  public onIntervalStop(): void {
    this._disableCurrentInterval();
    this.refreshIntervalChange.emit(this._disabledIntervalValue);
  }

  /**
   * Track by function for intervals.
   *
   * @param index
   * @param item
   *
   * @returns interval value
   */
  public trackByInterval(index: number, interval: Interval): number {
    return interval.value;
  }

  /**
   * Disable current interval.
   */
  private _disableCurrentInterval(): void {
    this._currentInterval.next({
      value: this._disabledIntervalValue,
      label: '', // Label is not used when interval is stopped
    });
  }

  /**
   * Format interval to human readable string.
   *
   * @param interval Interval in milliseconds
   *
   * @returns Human readable string
   */
  private _formatInterval(interval: number): string {
    const minutes = Math.floor(interval / 60_000);
    const seconds = Math.floor((interval % 60_000) / 1_000);

    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }

    return `${seconds}s`;
  }
}
