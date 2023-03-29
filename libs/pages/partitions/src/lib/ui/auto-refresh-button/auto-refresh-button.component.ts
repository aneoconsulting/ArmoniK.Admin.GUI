import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { ClrDropdownModule } from "@clr/angular";
import { Interval } from "../../types/interval";
import { Subscription, timer } from "rxjs";
import { NgForOf, NgIf } from "@angular/common";
import '@angular/localize/init';

// TODO: Add many tests
@Component({
  standalone: true,
  selector: 'armonik-admin-gui-auto-refresh-button',
  templateUrl: './auto-refresh-button.component.html',
  styleUrls: ['./auto-refresh-button.component.scss'],
  imports: [
    ClrDropdownModule,
    NgForOf,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoRefreshButtonComponent implements OnInit, OnDestroy {
  @Input() interval: number | null = null;

  // Return only an event to notify parent component.
  @Output() refresh = new EventEmitter<void>();
  @Output() intervalChange = new EventEmitter<number | null>();

  private _intervalsValues = [10_000, 30_000, 60_000, 120_000];
  private _currentIntervalValue: number | null = null;
  public intervals: Interval[] = this._intervalsValues.map((interval) => this._toInterval(interval));


  private _intervalId: Subscription | null = null;

  ngOnInit(): void {
    this._currentIntervalValue = this.interval;
    if (this._currentIntervalValue) {
      this._intervalId = this._startInterval(this._currentIntervalValue);
    } else
      this._intervalId = this._startInterval();
  }

  ngOnDestroy(): void {
    this._stopInterval()
  }

  onIntervalChange(interval: Interval): void {
    this._currentIntervalValue = interval.value;
    this._stopInterval()
    this._intervalId = this._startInterval();
    this._emitIntervalChange();
  }

  onIntervalStop(): void {
    this._stopInterval()
    this._currentIntervalValue = null
    this._emitIntervalChange();
  }

  public currentInterval(): Interval {
    if (!this._currentIntervalValue) {
      return {
        label: $localize`Disabled`,
        value: null
      };
    }

    return this._toInterval(this._currentIntervalValue);
  }

  /**
   * Start interval. State is handle internally.
   *
   * @returns Subscription
   */
  private _startInterval(dueTime: number = 0): Subscription {
    if (!this._currentIntervalValue) {
      return new Subscription();
    }

    return timer(dueTime, this._currentIntervalValue).subscribe(() => {
      this.refresh.emit();
    });
  }

  /**
   * Stop interval. State is handle internally.
   */
  private _stopInterval(): void {
    if (this._intervalId) {
      this._intervalId.unsubscribe();
    }
  }

  /**
   * Emit interval change.
   */
  private _emitIntervalChange(): void {
    this.intervalChange.emit(this._currentIntervalValue);
  }

  /**
   * Convert interval to Interval type.
   * @param interval Interval in milliseconds
   * @returns Interval type
   */
  private _toInterval(interval: number): Interval {
    return {
      value: interval,
      label: this._formatInterval(interval),
    };
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

  /**
   * Track by function for intervals.
   *
   * @param index
   * @param item
   *
   * @returns interval value
   */
  public trackByInterval(index: number, interval: Interval): number {
    return interval.value || index;
  }

}
