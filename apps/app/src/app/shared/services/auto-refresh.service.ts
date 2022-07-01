import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class AutoRefreshService implements OnDestroy {
  defaultTimer = 10_000;
  defaultTimersList: number[] = [10_000, 30_000, 60_000, 120_000];
  autoRefreshInterval: ReturnType<typeof setInterval> | null = null;

  private autoRefreshFn: () => void = () => {
    throw new Error('AutoRefreshService.autoRefreshFn is not set');
  };

  ngOnDestroy() {
    this.disableAutoRefresh();
  }

  /**
   * Set function to be called
   *
   * @param fn
   */
  setAutoRefreshFn(fn: () => void) {
    this.autoRefreshFn = fn;
    return this;
  }

  /**
   * Set timer to be used for auto refresh
   *
   * @param timer
   *
   * @returns this
   */
  setTimer(timer: number) {
    this.defaultTimer = timer;
    return this;
  }

  /**
   * Enable auto refresh
   */
  enableAutoRefresh() {
    if (this.autoRefreshFn) {
      this.autoRefreshInterval = setInterval(
        this.autoRefreshFn,
        this.defaultTimer
      );
    }
  }

  /**
   * Disable auto refresh
   */
  disableAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  /**
   * Toggle the auto refresh
   */
  toggleAutoRefresh() {
    if (this.autoRefreshInterval) {
      this.disableAutoRefresh();
    } else {
      this.enableAutoRefresh();
    }
  }

  /**
   * Restart the auto refresh
   */
  restartAutoRefresh() {
    if (this.autoRefreshInterval) {
      this.disableAutoRefresh();
      this.enableAutoRefresh();
    }
  }
}
