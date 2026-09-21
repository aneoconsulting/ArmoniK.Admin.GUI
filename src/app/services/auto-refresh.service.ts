import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, combineLatest, distinctUntilChanged, fromEvent, interval, map, merge, startWith, switchMap } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  /**
   * Emits whether the tab is currently visible, starting with its current state.
   */
  private readonly visible$: Observable<boolean> = fromEvent(document, 'visibilitychange').pipe(
    map(() => document.visibilityState === 'visible'),
    startWith(document.visibilityState === 'visible'),
    distinctUntilChanged()
  );

  /**
   * Creates an observable containing the interval time before refreshing the data in a table.
   * The interval is paused while the tab is in the background, so no request is sent from a hidden tab.
   * @param intervalSubject The observable is depending on this subject, so if the the subject has a new value, the observable will be updated.
   * @param stopIntervalSubject The interval can be stopped if with this subject.
   * @returns the observable
   */
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>): Observable<number> {
    const period$ = merge(
      intervalSubject.pipe(map(value => value && (value > 0) ? value : 0)),
      stopIntervalSubject.pipe(map(() => 0))
    );

    return combineLatest([period$, this.visible$]).pipe(
      switchMap(([period, visible]) => {
        return period > 0 && visible ? interval(period * 1000) : EMPTY;
      })
    );
  }

  /**
   * Really simple function that returns the state or duration of the interval
   */
  autoRefreshTooltip(interval: number): string {
    if (interval <= 0) {
      return 'Auto-refresh is disabled';
    }

    return `Auto-refresh every ${interval} seconds`;
  }
}
