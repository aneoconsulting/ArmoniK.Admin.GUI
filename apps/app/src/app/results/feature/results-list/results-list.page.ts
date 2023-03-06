import {
  ListResultsRequest,
  ListResultsResponse,
  ResultRaw,
  ResultStatus,
} from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcResultsService } from '@armonik.admin.gui/results/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  concatMap,
  merge,
  of,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import {
  IdFilterComponent,
  SelectFilterComponent,
} from '../../../shared/feature/filters';
import { SettingsService } from '../../../shared/util';

@Component({
  selector: 'app-pages-results-list',
  templateUrl: './results-list.page.html',
  styleUrls: ['./results-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultsListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};
  private _intervalValue = this._settingsService.intervalQueryParam(
    this._activatedRoute.snapshot.queryParams
  );

  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

  /** Triggers to reload data */
  private _triggerManual$ = this._subjectManual.asObservable();
  private _triggerDatagrid$ = this._subjectDatagrid.asObservable().pipe(
    tap((state) => this._saveState(state)),
    concatMap(async (state) => {
      const params = this._grpcResultsService.createListRequestParams(state);
      const queryParams = this._grpcResultsService.createListRequestQueryParams(
        params,
        this._intervalValue
      );

      await this._router.navigate([], {
        queryParams,
        relativeTo: this._activatedRoute,
      });
      return state;
    })
  );
  private _triggerInterval$: Observable<number> = timer(
    0,
    this._intervalValue
  ).pipe(takeUntil(this.stopInterval$));

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
  nameFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'name'
  );
  taskIdFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'ownerTaskId'
  );
  sessionIdFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'sessionId'
  );
  statusFilter: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'status'
  );
  createdBeforeFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdBefore'
  );
  createdAfterFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdAfter'
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _grpcResultsService: GrpcResultsService
  ) {}

  ngOnInit(): void {
    this.statusList = [
      ...Object.keys(ResultStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: ResultStatus[key as keyof typeof ResultStatus] as number,
          label: this.getStatusLabel(
            ResultStatus[key as keyof typeof ResultStatus]
          ),
        })),
    ];
  }

  public get refreshIntervalValue() {
    return this._intervalValue;
  }

  public get page$(): Observable<number> {
    return this._settingsService.queryParam$(
      this._activatedRoute.queryParamMap,
      'page'
    );
  }

  public get pageSize$(): Observable<number> {
    return this._settingsService.queryParam$(
      this._activatedRoute.queryParamMap,
      'pageSize'
    );
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

  public getStatusLabel(status: number): string {
    switch (status) {
      case ResultStatus.RESULT_STATUS_ABORTED:
        return $localize`Aborted`;
      case ResultStatus.RESULT_STATUS_CREATED:
        return $localize`Created`;
      case ResultStatus.RESULT_STATUS_COMPLETED:
        return $localize`Completed`;
      case ResultStatus.RESULT_STATUS_NOTFOUND:
        return $localize`Not found`;
      case ResultStatus.RESULT_STATUS_UNSPECIFIED:
        return $localize`Unspecified`;
      default:
        return $localize`Unknown`;
    }
  }

  public onUpdateInterval(value: number) {
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
    this._intervalValue = value;
    this._subjectDatagrid.next(this._state);
  }

  public defaultSortOrder(
    field: ListResultsRequest.OrderByField
  ): ClrDatagridSortOrder {
    const orderBy = Number(
      this._activatedRoute.snapshot.queryParamMap.get('orderBy')
    );

    if (orderBy !== field) return ClrDatagridSortOrder.UNSORTED;

    const order =
      Number(this._activatedRoute.snapshot.queryParamMap.get('order')) ||
      ListResultsRequest.OrderDirection.ORDER_DIRECTION_ASC;

    if (order === ListResultsRequest.OrderDirection.ORDER_DIRECTION_DESC)
      return ClrDatagridSortOrder.DESC;

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
    const state = this._restoreState();
    const params = this._grpcResultsService.createListRequestParams(state);
    const options = this._grpcResultsService.createListRequestOptions(params);
    return this._grpcResultsService.list$(options).pipe(
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
   * Set a new filter value via clicking a link in the datagrid.
   *
   * @param filter the filter to change.
   * @param value the new filter value.
   */
  setFilterViaGridLink(
    filter: IdFilterComponent | SelectFilterComponent,
    value: string | number
  ) {
    filter.selectedValue = value;
    filter.changes.emit();
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
    // Reset the filters so that they doesn't stay active
    this._state.filters?.forEach((filter) => {
      filter.reset();
    });
    delete this._state.filters;
    this._subjectDatagrid.next(this._state);
  }
}
