import { Component, OnInit } from '@angular/core';
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
  BrowserTitleService,
  GrpcPagerService,
  GrpcResultsService,
  LanguageService,
  SettingsService,
} from '../../../core';
import { ResultStatus } from '../../../core/types/proto/result-status.pb';
import {
  ListResultsRequest,
  ListResultsResponse,
  ResultRaw,
} from '../../../core/types/proto/results-common.pb';

@Component({
  selector: 'app-pages-results-list',
  templateUrl: './results-list.component.html',
  styleUrls: ['./results-list.component.scss'],
})
export class ResultsListComponent implements OnInit {
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

  /**
   * Observable filters
   * Permits to avoid redundant calls of queryParams function due to async pipe.
   */
  nameFilter$: Observable<string> = this.queryStringParam$('name');
  taskIdFilter$: Observable<string> = this.queryStringParam$('taskId');
  sessionIdFilter$: Observable<string> = this.queryStringParam$('sessionId');
  statusFilter$: Observable<number> = this.queryParam$('status');
  createdBeforeFilter$: Observable<Date | null> =
    this.queryDateParam$('createdAtBefore');
  createdAfterFilter$: Observable<Date | null> =
    this.queryDateParam$('createdAtAfter');

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _languageService: LanguageService,
    private _settingsService: SettingsService,
    private _grpcResultsService: GrpcResultsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle(
      this._languageService.instant('results.title')
    );
  }

  public get OrderByField() {
    return ListResultsRequest.OrderByField;
  }

  public get ResultsStatusEnum() {
    return ResultStatus;
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
   * Get query params from route and return them as string
   *
   * @param param
   *
   * @returns Observable<string>
   */
  public queryStringParam$(param: string): Observable<string> {
    return this._activatedRoute.queryParamMap.pipe(
      map((urlParams) => urlParams.get(param)),
      map((value) => (value !== null ? value : '')),
      distinctUntilChanged()
    );
  }

  /**
   * Get query params from route and return them as Date
   *
   * @param param
   *
   * @returns Observable<Date | null>
   */
  public queryDateParam$(param: string): Observable<Date | null> {
    return this._activatedRoute.queryParamMap.pipe(
      map((urlParams) => urlParams.get(param)),
      map((value) => {
        if (!value) {
          return null;
        }

        const numberDate = Number(value);
        if (isNaN(numberDate)) {
          return null;
        }

        return new Date(numberDate);
      }),
      distinctUntilChanged()
    );
  }

  /**
   * Track by result
   *
   * @param _
   * @param result
   *
   * @returns Id
   */
  public trackByResult(_: number, result: ResultRaw): string {
    return result.name ?? '';
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
    const urlParams = this._grpcPagerService.createParams(this._restoreState());
    // const grpcParams = this._grpcPagerService.urlToGrpcParams(urlParams);
    return this._grpcResultsService.list$(urlParams).pipe(
      catchError((error) => {
        console.error(error);
        this.stopInterval();

        return of({} as ListResultsResponse);
      }),
      tap((results) => {
        this.loadingResults$.next(false);
        this.totalResults$.next(results.total ?? 0);
      })
    );
  }

  /**
   * Checks if any filter is applied to the datagrid
   *
   * @returns true if yes, false if no
   */
  isFiltered(): boolean {
    return !!this._state.filters;
  }

  /**
   * Clear all filters currently applied to the datagrid
   */
  clearAllFilters(): void {
    delete this._state.filters;
    this._subjectDatagrid.next(this._state);
  }
}
