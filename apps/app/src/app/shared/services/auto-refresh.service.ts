import { Injectable, OnDestroy } from '@angular/core';

@Injectable()
export class AutoRefreshService implements OnDestroy {
  timer = 10_000;
  timersList: number[] = [10_000, 30_000, 60_000, 120_000];
  interval: ReturnType<typeof setInterval> | null = null;

  private fn: () => void = () => {
    throw new Error('AutoRefreshService.autoRefreshFn is not set');
  };

  ngOnDestroy() {
    this.disable();
  }

  /**
   * Set function to be called
   *
   * @param fn
   */
  setFn(fn: () => void) {
    this.fn = fn;
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
    this.timer = timer;
    return this;
  }

  /**
   * Enable auto refresh
   */
  enable() {
    if (this.fn) {
      this.interval = setInterval(this.fn, this.timer);
    }
  }

  /**
   * Disable auto refresh
   */
  disable() {
    if (this.isEnabled()) {
      clearInterval(this.interval as ReturnType<typeof setInterval>);
    }
    this.interval = null;
  }

  /**
   * Toggle the auto refresh
   */
  toggle() {
    if (this.isEnabled()) {
      this.disable();
    } else {
      this.enable();
    }
  }

  /**
   * Restart the auto refresh
   */
  restart() {
    this.disable();
    this.enable();
  }

  /**
   * Get if auto refresh is enabled
   */
  isEnabled() {
    return this.interval !== null;
  }
}
