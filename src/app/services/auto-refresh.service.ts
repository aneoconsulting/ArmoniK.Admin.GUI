import { Injectable } from '@angular/core';
import { Subject, interval, merge, of, switchMap, takeUntil } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>) {
    return merge(intervalSubject).pipe(
      switchMap((value) => {
        if (!value || value < 0) return of(undefined);
        else return interval((value as number) * 1000).pipe(takeUntil(stopIntervalSubject));
      })
    );
  }

  autoRefreshTooltip(interval: number): string {
    if (interval <= 0) {
      return 'Auto-refresh is disabled';
    }

    return `Auto-refresh every ${interval} seconds`;
  }
}
