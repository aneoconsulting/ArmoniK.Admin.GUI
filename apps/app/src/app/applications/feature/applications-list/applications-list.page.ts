import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcApplicationsService } from '@armonik.admin.gui/applications/data-access';
import {
  ApplicationRaw,
  GrpcPagerService,
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '@armonik.admin.gui/shared/data-access';
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
import { SettingsService } from '../../../shared/util';

@Component({
  selector: 'app-pages-applications-list',
  templateUrl: './applications-list.page.html',
  styleUrls: ['./applications-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsListComponent {
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

  loadingApplications$ = new BehaviorSubject<boolean>(true);
  totalApplications$ = new BehaviorSubject<number>(0);

  loadApplications$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingApplications$.next(true)),
    switchMap(() => this._listApplications$())
  );

  nameFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'name'
  );
  versionFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'version'
  );
  namespaceFilter: string | null =
    this._settingsService.queryParam(
      this._activatedRoute.snapshot.queryParams,
      'namespace'
    );
  serviceFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'service'
  );
  pageSize: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'pageSize'
  );
  page: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'page'
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _grpcApplicationsService: GrpcApplicationsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  public get OrderByField() {
    return ListApplicationsRequest.OrderByField;
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
    field: ListApplicationsRequest.OrderByField
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
   * Refresh applications using a new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshApplications(state: ClrDatagridStateInterface): void {
    this._subjectDatagrid.next(state);
  }

  /**
   * Refresh manually applications using new state
   *
   * @returns void
   */
  public manualRefreshApplications(): void {
    this._subjectManual.next();
  }

  /**
   * Track by application
   *
   * @param _
   * @param application
   *
   * @returns Id
   */
  public trackByApplication(_: number, application: ApplicationRaw): string {
    return application.name ?? '';
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
   * List applications
   *
   * @returns Observable<ListApplicationsResponse>
   */
  private _listApplications$(): Observable<ListApplicationsResponse> {
    const params = this._grpcPagerService.createParams(this._restoreState());
    const grpcParams = this._grpcApplicationsService.urlToGrpcParams(params);
    return this._grpcApplicationsService.list$(grpcParams).pipe(
      catchError((error) => {
        console.error(error);
        this._stopInterval.next();

        return of({} as ListApplicationsResponse);
      }),
      tap((applications) => {
        this.loadingApplications$.next(false);
        this.totalApplications$.next(applications.total ?? 0);
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
   * Checks if one filter is applied to the datagrid
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
