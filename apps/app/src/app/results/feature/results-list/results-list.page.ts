import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcResultsService } from '@armonik.admin.gui/results/data-access';
import {
  GrpcPagerService,
  ListResultsRequest,
  ListResultsResponse,
  ResultRaw,
  ResultStatus,
} from '@armonik.admin.gui/shared/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { BrowserTitleService, SettingsService } from '../../../shared/util';

@Component({
  selector: 'app-pages-results-list',
  templateUrl: './results-list.page.html',
  styleUrls: ['./results-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};

  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _intervalValue = new Subject<number>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

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
  private _triggerInterval$ = this._intervalValue
    .asObservable()
    .pipe(
      switchMap((time) => timer(0, time).pipe(takeUntil(this.stopInterval$)))
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

  //Filter status, to be send into the select-filter component.
  statusList: { value: number; label: string }[];

  /**
   * Observable filters
   * Permits to avoid redundant calls of queryParams function due to async pipe.
   */
  nameFilter$: Observable<string> = this._settingsService.queryStringParam$(
    this._activatedRoute.queryParamMap,
    'name'
  );
  taskIdFilter$: Observable<string> = this._settingsService.queryStringParam$(
    this._activatedRoute.queryParamMap,
    'taskId'
  );
  sessionIdFilter$: Observable<string> =
    this._settingsService.queryStringParam$(
      this._activatedRoute.queryParamMap,
      'sessionId'
    );
  statusFilter$: Observable<number> = this._settingsService.queryParam$(
    this._activatedRoute.queryParamMap,
    'status'
  );
  createdBeforeFilter$: Observable<Date | null> =
    this._settingsService.queryDateParam$(
      this._activatedRoute.queryParamMap,
      'createdAtBefore'
    );
  createdAfterFilter$: Observable<Date | null> =
    this._settingsService.queryDateParam$(
      this._activatedRoute.queryParamMap,
      'createdAtAfter'
    );

  pageSize$: Observable<number> = this._settingsService.queryParam$(
    this._activatedRoute.queryParamMap,
    'pageSize'
  );
  page$: Observable<number> = this._settingsService.queryParam$(
    this._activatedRoute.queryParamMap,
    'page'
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _settingsService: SettingsService,
    private _grpcResultsService: GrpcResultsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle($localize`Results`);
    this.statusList = [
      ...Object.keys(ResultStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: ResultStatus[key as keyof typeof ResultStatus] as number,
          label: key,
        })),
    ];
  }

  public get OrderByField() {
    return ListResultsRequest.OrderByField;
  }

  public get ResultsStatusEnum() {
    return ResultStatus;
  }

  public get intervals() {
    return this._settingsService.intervals;
  }

  public get initialInterval() {
    return this._settingsService.initialInterval;
  }

  public onUpdateInterval(value: number) {
    this._intervalValue.next(value);

    // Stop interval
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
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
    const grpcParams = this._grpcResultsService.urlToGrpcParams(urlParams);
    return this._grpcResultsService.list$(grpcParams).pipe(
      catchError((error) => {
        console.error(error);
        this._stopInterval.next();

        return of({} as ListResultsResponse);
      }),
      tap((results) => {
        this.loadingResults$.next(false);
        this.totalResults$.next(results.total ?? 0);
      })
    );
  }

  /**
   * Checks if the datagrid is ordered by any column
   *
   * @returns true if yes, false if no
   */
  isOrdered(): boolean {
    return !!this._state.sort;
  }

  /**
   * Set the datagrid to the default order
   */
  clearOrder(): void {
    delete this._state.sort;
    this._subjectDatagrid.next(this._state);
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
