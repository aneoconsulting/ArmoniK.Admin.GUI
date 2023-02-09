import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcSessionsService } from '@armonik.admin.gui/sessions/data-access';
import {
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionStatus,
} from '@armonik.admin.gui/shared/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  concatMap,
  first,
  merge,
  of,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { SettingsService } from '../../../shared/util';
import { AuthorizationService } from '../../../shared/data-access';

@Component({
  selector: 'app-pages-sessions-list',
  templateUrl: './sessions-list.page.html',
  styleUrls: ['./sessions-list.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsListComponent {
  private _state: ClrDatagridStateInterface = {};
  private _intervalValue = this._settingsService.intervalQueryParam(
    this._activatedRoute.snapshot.queryParams
  );

  /** Get a single session */
  private _opened$ = new BehaviorSubject<boolean>(false);
  private _subjectSingleSession = new Subject<string>();
  private _triggerSingleSession = this._subjectSingleSession.asObservable();

  loadingSingleSession$ = new BehaviorSubject<string | null>(null);
  loadSingleSession$ = this._triggerSingleSession.pipe(
    tap((sessionId) => this.loadingSingleSession$.next(sessionId)),
    switchMap((sessionId) => this._getSession$(sessionId))
  );

  /** Get sessions */
  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

  /** Triggers to reload sessions */
  private _triggerManual$ = this._subjectManual.asObservable();
  private _triggerDatagrid$ = this._subjectDatagrid.asObservable().pipe(
    tap((state) => this._saveState(state)),
    concatMap(async (state) => {
      this.setApplicationFilter('applicationName', this.applicationName);
      this.setApplicationFilter('applicationVersion', this.applicationVersion);
      const params = this._grpcSessionsService.createListRequestParams(state);
      const queryParams =
        this._grpcSessionsService.createListRequestQueryParams(params, this._intervalValue);

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

  loadingSessions$ = new BehaviorSubject<boolean>(true);
  totalSessions$ = new BehaviorSubject<number>(0);

  loadSessions$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingSessions$.next(true)),
    switchMap(() => this._listSessions$())
  );

  sessionsStatusList: { value: number; label: string }[] = [
    ...Object.keys(SessionStatus)
      .filter((key) => !Number.isInteger(parseInt(key)))
      .map((key) => ({
        value: SessionStatus[key as keyof typeof SessionStatus],
        label: this.getStatusLabel(
          SessionStatus[key as keyof typeof SessionStatus]
        ),
      })),
  ];

  /**
   * Filter observables.
   * They permit to avoid the endless loop due to the async pipe with the functions.
   */
  sessionFilter: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'sessionId'
  );
  statusFilter: number | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'status'
  );
  createdBeforeFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdAtBefore'
  );
  createdAfterFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdAtAfter'
  );
  cancelledBeforeFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'cancelledAtBefore'
  );
  cancelledAfterFilter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'cancelledAtAfter'
  );

  applicationName: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'applicationName'
  );

  applicationVersion: string | null = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'applicationVersion'
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _grpcSessionsService: GrpcSessionsService,
    private _authorizationService: AuthorizationService,
    private _settingsService: SettingsService
  ) {}

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
    return ListSessionsRequest.OrderByField;
  }

  public get SessionStatusEnum() {
    return SessionStatus;
  }

  public canCancelSession(): boolean {
    return this._authorizationService.canCancelSession();
  }

  public getStatusLabel(status: number): string {
    switch (status) {
      case SessionStatus.SESSION_STATUS_CANCELLED:
        return $localize`Cancelled`;
      case SessionStatus.SESSION_STATUS_RUNNING:
        return $localize`Running`;
      case SessionStatus.SESSION_STATUS_UNSPECIFIED:
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

  // TODO: Move to a service (once https://github.com/aneoconsulting/ArmoniK.Api/issues/87 is resolved)
  public defaultSortOrder(
    field: ListSessionsRequest.OrderByField
  ): ClrDatagridSortOrder {
    const orderBy = Number(
      this._activatedRoute.snapshot.queryParamMap.get('orderBy')
    );

    if (orderBy !== field) return ClrDatagridSortOrder.UNSORTED;

    const order =
      Number(this._activatedRoute.snapshot.queryParamMap.get('order')) ||
      ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC;

    if (order === ListSessionsRequest.OrderDirection.ORDER_DIRECTION_DESC)
      return ClrDatagridSortOrder.DESC;

    return ClrDatagridSortOrder.ASC;
  }

  /**
   * Cancel a session
   *
   * @param sessionId
   */
  public cancelSession(sessionId: string): void {
    this._grpcSessionsService
      .cancel$(sessionId)
      .pipe(
        first(),
        catchError((error: Error) => {
          console.error(error);

          return of({} as ListSessionsResponse);
        })
      )
      .subscribe({
        next: () => this.manualRefreshSessions(),
      });
  }

  /**
   * Call a new session
   *
   * @param sessionId
   */
  public viewSessionDetail(sessionId: string): void {
    this._subjectSingleSession.next(sessionId);
  }

  /**
   * Open modal to view details
   */
  public openGetSessionModal(): void {
    this._opened$.next(true);
  }

  /**
   * Close modal to view details
   */
  public closeGetSessionModal(): void {
    this._opened$.next(false);
  }

  public get isGetSessionModalOpened$(): Observable<boolean> {
    return this._opened$.asObservable();
  }

  /**
   * Refresh sessions using a new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshSessions(state: ClrDatagridStateInterface): void {
    this._subjectDatagrid.next(state);
  }

  /**
   * Refresh manually sessions using new state
   *
   * @returns void
   */
  public manualRefreshSessions(): void {
    this._subjectManual.next();
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

  public get hasApplicationFilter() {
    return this.applicationName !== null || this.applicationVersion !== null;
  }

  /**
   * Add or remove an application related filter to the filters.
   *
   * Application filters works independently from other filters, since are not part of the Session Response.
   *
   * @param property The property of the filter
   * @param value The value of the filter
   */
  public setApplicationFilter(property: string, value: string | null) {
    if (value) {
      if (!this._state.filters) {
        this._state.filters = [];
      }
      const filter = this._state.filters.find((f) => f.property === property);
      if (filter) {
        filter.value = value;
      } else {
        this._state.filters?.push({
          property: property,
          value: value,
        });
      }
    } else if (this._state.filters) {
      this._state.filters = this._state.filters.filter(
        (f) => f.property !== property
      );
      if (this._state.filters.length === 0) {
        delete this._state.filters;
      }
    }
  }

  public onApplicationFilterChange() {
    this._subjectDatagrid.next(this._state);
  }

  /**
   * List sessions
   *
   * @returns Observable<ListSessionsResponse>
   */
  private _listSessions$(): Observable<ListSessionsResponse> {
    const state = this._restoreState();
    const params = this._grpcSessionsService.createListRequestParams(state);
    const options = this._grpcSessionsService.createListRequestOptions(params);

    return this._grpcSessionsService.list$(options).pipe(
      catchError((error: Error) => {
        console.error(error);
        this._stopInterval.next();

        return of({} as ListSessionsResponse);
      }),
      tap((sessions) => {
        this.loadingSessions$.next(false);
        this.totalSessions$.next(sessions.total ?? 0);
      })
    );
  }

  /**
   * Get single session
   *
   * @returns Observable<GetSessionResponse>
   */
  private _getSession$(sessionId: string): Observable<GetSessionResponse> {
    return this._grpcSessionsService.get$(sessionId).pipe(
      catchError((error: Error) => {
        console.error(error);

        return of({} as GetSessionResponse);
      }),
      tap(() => {
        this.openGetSessionModal();
        this.loadingSingleSession$.next(null);
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
    this._state.filters?.forEach((f) => {
      // Permit to avoid filter to stay active after clearing
      if (
        f.property !== 'applicationVersion' &&
        f.property !== 'applicationName'
      ) {
        f.clear();
      }
      f = undefined;
    });
    //Clearing applicationName and applicationVersion
    this.applicationName = null;
    this.applicationVersion = null;
    this._subjectDatagrid.next(this._state);
  }

  /**
   * Clear the application filters.
   *
   * The filters themselves are not destroyed, but the strings they are build upon are set to empty.
   */
  clearApplicationFilter(): void {
    this.applicationName = null;
    this.applicationVersion = null;
    this._subjectDatagrid.next(this._state);
  }
}
