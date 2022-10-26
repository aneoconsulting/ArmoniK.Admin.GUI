import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  distinctUntilChanged,
  interval,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import {
  GrpcPagerService,
  GrpcResultsService,
  SettingsService,
} from '../../../core';
import {
  ListResultsRequest,
  ListResultsResponse,
} from '../../../core/types/proto/results-common.pb';

@Component({
  selector: 'app-pages-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
})
export class ResultsListComponent {
  private _state: ClrDatagridStateInterface = {};

  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _subjectInterval = new BehaviorSubject<number>(this.initialInterval);
  private _subjectStopInterval = new Subject<void>();

  /** Triggers to reload data */
  private _triggerManual$ = this._subjectManual.asObservable();
  private _triggerDatagrid$ = this._subjectDatagrid.asObservable().pipe(
    tap((state) => this._saveState(state)),
    concatMap(async (state) => {
      const params = this._grpcPagerService.createParams(state);
      await this._router.navigate([], {
        queryParams: params,
        queryParamsHandling: 'merge',
        relativeTo: this._activatedRoute,
      });
      return state;
    })
  );
  private _triggerInterval$ = this.subjectInterval
    .asObservable()
    .pipe(
      switchMap((time) =>
        interval(time).pipe(takeUntil(this._subjectStopInterval.asObservable()))
      )
    );

  loadingResults$ = new BehaviorSubject<boolean>(true);
  totalResults$ = new BehaviorSubject<number>(0);

  loadResults$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingResults$.next(true)),
    switchMap(() => this._listResults$())
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _grpcResultsService: GrpcResultsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  public get OrderByField() {
    return ListResultsRequest.OrderByField;
  }

  public get subjectInterval() {
    return this._subjectInterval;
  }

  public get intervals() {
    return this._settingsService.intervals;
  }

  public get initialInterval() {
    return this._settingsService.initialInterval;
  }

  public defaultSortOrder(
    field: ListResultsRequest.OrderByField
  ): ClrDatagridSortOrder {
    const orderBy = Number(
      this._activatedRoute.snapshot.queryParamMap.get('orderBy')
    );

    if (orderBy !== field) return ClrDatagridSortOrder.UNSORTED;

    const order =
      Number(this._activatedRoute.snapshot.queryParamMap.get('order')) || 1;

    if (order === -1) return ClrDatagridSortOrder.DESC;

    return ClrDatagridSortOrder.ASC;
  }

  /**
   * Change interval
   *
   * @param number
   */
  public changeInterval(value: number): void {
    this.subjectInterval.next(value);
  }

  /**
   * Stop interval
   */
  public stopInterval(): void {
    this.subjectInterval.next(-1);
    this._subjectStopInterval.next();
  }

  /**
   * Track by interval
   *
   * @param _
   * @param interval
   *
   * @returns Interval
   */
  public trackByInterval(_: number, interval: number): string {
    return interval.toString();
  }

  /**
   * Refresh results using a new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshResults(state: ClrDatagridStateInterface): void {
    this._subjectDatagrid.next(state);
  }

  /**
   * Refresh manually results using new state
   *
   * @returns void
   */
  public manualRefreshResults(): void {
    this._subjectManual.next();
  }

  /**
   * Get query params from route
   *
   * @param param
   *
   * @returns Observable<string>
   */
  public queryParam$(param: string): Observable<number> {
    return this._activatedRoute.queryParamMap.pipe(
      map((params) => params.get(param)),
      map((value) => Number(value)),
      distinctUntilChanged()
    );
  }

  /**
   * Save state
   *
   * @param state
   */
  private _saveState(state: ClrDatagridStateInterface): void {
    this._state = state;
  }

  /**
   * Restore state
   *
   * @returns State
   */
  private _restoreState(): ClrDatagridStateInterface {
    return this._state;
  }

  /**
   * List results
   *
   * @returns Observable<ListResultsResponse>
   */
  private _listResults$(): Observable<ListResultsResponse> {
    const params = this._grpcPagerService.createParams(this._restoreState());
    const httpParams = this._grpcPagerService.createHttpParams(params);
    return this._grpcResultsService.list$(httpParams).pipe(
      catchError((error) => {
        console.error(error);
        return of({} as ListResultsResponse);
      }),
      tap((results) => {
        this.loadingResults$.next(false);
        this.totalResults$.next(results.total ?? 0);
      })
    );
  }
}
