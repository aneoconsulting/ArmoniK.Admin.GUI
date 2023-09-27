import { Injectable } from '@angular/core';
import { Observable, Subject, interval, map, merge, switchMap, takeUntil } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  /**
   * Creates an observable containing the interval time before refreshing the data in a table.
   * @param intervalSubject The observable is depending on this subject, so if the the subject has a new value, the observable will update.
   * @param stopIntervalSubject The interval can be stoped if with this subjet.
   * @returns the observable
   */
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>): Observable<number> {
    return merge(intervalSubject).pipe(
      map(value => !value || value < 0 ? value = 0 : value),
      switchMap((value) => {
        return interval((value as number) * 1000).pipe(takeUntil(stopIntervalSubject));
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
