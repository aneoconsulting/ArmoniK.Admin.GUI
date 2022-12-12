import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged, filter, map, Observable, tap } from 'rxjs';

@Injectable()
export class AutoRefreshService {
  private _intervalQueryParamName = 'interval';

  constructor(private _activatedRoute: ActivatedRoute) {}

  public get intervalQueryParam$(): Observable<number | null> {
    return this._activatedRoute.queryParams.pipe(
      tap((params) => console.log('queryParams', params)),
      map((params) => params[this._intervalQueryParamName]),
      map((interval) => (interval ? parseInt(interval, 10) : null)),
      tap((interval) => console.log('intervalQueryParam$', interval))
    );
  }

  public get intervalQueryParamNotNull$(): Observable<number> {
    return this.intervalQueryParam$.pipe(
      tap((interval) => console.log('intervalQueryParamNotNull$', interval)),
      filter((interval): interval is number => interval !== null),
      tap((interval) =>
        console.log('intervalQueryParamNotNull$ after', interval)
      )
    );
  }

  public get intervalQueryParamNull$(): Observable<null> {
    return this.intervalQueryParam$.pipe(
      tap((interval) => console.log('intervalQueryParamNull$', interval)),
      filter((interval): interval is null => interval === null),
      tap((interval) => console.log('intervalQueryParamNull$ after', interval))
    );
  }
}
