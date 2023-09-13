import { Injectable } from '@angular/core';
import { Observable, Subject, interval, map, merge, switchMap, takeUntil } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  createInterval(intervalSubject: Subject<number>, stopIntervalSubject: Subject<void>): Observable<number> {
    return merge(intervalSubject).pipe(
      map(value => !value || value < 0 ? value = 0 : value),
      switchMap((value) => {
        return interval((value as number) * 1000).pipe(takeUntil(stopIntervalSubject));
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
