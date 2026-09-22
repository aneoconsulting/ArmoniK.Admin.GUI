import { Injectable } from '@angular/core';
import { EMPTY, Observable, Subject, combineLatest, distinctUntilChanged, fromEvent, interval, map, merge, startWith, switchMap, tap } from 'rxjs';

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
   * Coming back to a tab that stayed hidden longer than the period emits right away, so the data is never older than the period the user asked for.
   * @param intervalSubject The observable is depending on this subject, so if the the subject has a new value, the observable will be updated.
   * @param stopIntervalSubject The interval can be stopped if with this subject.
   * @returns the observable
   */
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>): Observable<number> {
    /** Last time the data was known to be up-to-date: either a tick, or a change of the period. */
    let lastRefresh = Date.now();

    const period$ = merge(
      intervalSubject.pipe(map(value => value && (value > 0) ? value : 0)),
      stopIntervalSubject.pipe(map(() => 0))
    ).pipe(tap(() => lastRefresh = Date.now()));

    return combineLatest([period$, this.visible$]).pipe(
      switchMap(([period, visible]) => {
        if (period <= 0 || !visible) {
          return EMPTY;
        }

        const ticks$ = interval(period * 1000);
        return Date.now() - lastRefresh >= period * 1000 ? ticks$.pipe(startWith(0)) : ticks$;
      }),
      tap(() => lastRefresh = Date.now())
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
