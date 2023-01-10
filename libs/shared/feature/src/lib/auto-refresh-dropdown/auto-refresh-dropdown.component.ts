import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClrDropdownModule } from '@clr/angular';

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
  imports: [ClrDropdownModule, NgIf, NgFor, AsyncPipe],
})
export class AutoRefreshDropdownComponent {
  @Input() actualInterval = 10000;
  @Output() refreshIntervalChange = new EventEmitter<number>();

  private _intervalsValues = [10_000, 30_000, 60_000, 120_000];
  private _disabledIntervalValue = DisabledIntervalValue;

  public intervals: Interval[] = this._intervalsValues.map((interval) =>
    this._toInterval(interval)
  );

  public get interval() {
    return this._toInterval(this.actualInterval);
  }

  /**
   * Emit refresh interval.
   *
   * @param interval Interval in milliseconds
   */
  public onIntervalChange(interval: Interval): void {
    this.actualInterval = interval.value;
    this.refreshIntervalChange.emit(interval.value);
  }

  /**
   * Stop interval.
   */
  public onIntervalStop(): void {
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

  private _toInterval(interval: number): Interval {
    return {
      value: interval,
      label: this._formatInterval(interval),
    };
  }
}
