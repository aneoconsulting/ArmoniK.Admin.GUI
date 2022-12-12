import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AutoRefreshService } from '@armonik.admin.gui/shared/util';
import { ClrDropdownModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';

type Interval = {
  value: number;
  label: string;
};

@Component({
  standalone: true,
  selector: 'armonik-admin-gui-auto-refresh-dropdown',
  templateUrl: './auto-refresh-dropdown.component.html',
  styleUrls: ['./auto-refresh-dropdown.component.scss'],
  imports: [
    RouterModule,
    ClrDropdownModule,
    TranslateModule,
    NgIf,
    NgFor,
    AsyncPipe,
  ],
  providers: [AutoRefreshService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutoRefreshDropdownComponent implements OnInit {
  private _intervalsValues = [10_000, 30_000, 60_000, 120_000];
  public intervals: Interval[] = this._intervalsValues.map((interval) => ({
    value: interval,
    label: this._formatInterval(interval),
  }));

  public intervalQueryParam$: Observable<string | null> | undefined;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.intervalQueryParam$ =
      this._autoRefreshService.intervalQueryParam$.pipe(
        map((interval) => (interval ? this._formatInterval(interval) : null))
      );
  }

  /**
   * Emit refresh interval
   *
   * @param interval Interval in milliseconds
   */
  public async onIntervalChange(interval: Interval): Promise<void> {
    await this._updateIntervalQueryParams(interval.value);
  }

  /**
   * Stop interval.
   */
  public async onIntervalStop(): Promise<void> {
    await this._updateIntervalQueryParams(null);
  }

  /**
   * Update interval in query params.
   *
   * @param value Interval
   */
  private async _updateIntervalQueryParams(
    value: number | null
  ): Promise<void> {
    console.log('updateIntervalQueryParams', value);
    await this._router.navigate([], {
      relativeTo: this._activatedRoute,
      queryParams: { interval: value },
      queryParamsHandling: 'merge',
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
}
