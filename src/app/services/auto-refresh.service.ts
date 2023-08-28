import { Injectable } from '@angular/core';
import { Subject, filter, interval, merge, switchMap, takeUntil } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>) {
    return merge(intervalSubject).pipe(
      filter((value) => {
        if (!value) {
          return false;
        }
        // Interval can be 0 but we don't want to start the timer
        return true;
      }),
      switchMap((value) => {
        // Value is in seconds, we need to convert it to milliseconds
        return interval((value as number) * 1000).pipe(takeUntil(stopIntervalSubject));
      })
    );
  }

  autoRefreshTooltip(interval: number): string {
    if (interval === 0) {
      return 'Auto-refresh is disabled';
    }

    return `Auto-refresh every ${interval} seconds`;
  }
}
