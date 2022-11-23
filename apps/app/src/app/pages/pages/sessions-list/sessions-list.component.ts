import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  first,
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
  GrpcSessionsService,
  LanguageService,
  SettingsService,
} from '../../../core';
import { SessionStatus } from '../../../core/types/proto/session-status.pb';
import {
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
} from '../../../core/types/proto/sessions-common.pb';

@Component({
  selector: 'app-pages-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};

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
  private _subjectInterval = new BehaviorSubject<number>(this.initialInterval);
  private _subjectStopInterval = new Subject<void>();
  private _subjectFilter = new Subject<void>();

  /** Triggers to reload sessions */
  private _triggerNewFilter$ = this._subjectFilter.asObservable();
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

  loadingSessions$ = new BehaviorSubject<boolean>(true);
  totalSessions$ = new BehaviorSubject<number>(0);

  loadSessions$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$,
    this._triggerNewFilter$
  ).pipe(
    tap(() => this.loadingSessions$.next(true)),
    switchMap(() => this._listSessions$())
  );

  /** Filters */
  sessionIdFilter = '';

  subjectSessionId = new Subject<string>();
  subjectStatus = new Subject<string[]>();

  subjectCreatedDate = new Subject<{ property: string; value: string }>();
  subjectClosedDate = new Subject<{ property: string; value: string }>();

  sessionId$ = this.subjectSessionId
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((value) => {
      this._filterState('sessionId', value);
      this._subjectFilter.next();
    });

  status$ = this.subjectStatus.subscribe((value) => {
    this._removeStatusFilters();
    if (value) this._addStatusFilters(value);
    this._subjectFilter.next();
  });

  createdDate$ = this.subjectCreatedDate
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((date) => {
      date.property =
        date.property == 'before' ? 'createdBefore' : 'createdAfter';
      this._filterState(date.property, date.value);
      this._subjectFilter.next();
    });

  closedDate$ = this.subjectClosedDate
    .pipe(debounceTime(300), distinctUntilChanged())
    .subscribe((date) => {
      date.property =
        date.property == 'before' ? 'closedBefore' : 'closedAfter';
      this._filterState(date.property, date.value);
      this._subjectFilter.next();
    });

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _languageService: LanguageService,
    private _settingsService: SettingsService,
    private _grpcSessionsService: GrpcSessionsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle(
      this._languageService.instant('pages.sessions-list.title')
    );
  }

  public get OrderByField() {
    return ListSessionsRequest.OrderByField;
  }

  public get SessionStatusEnum() {
    return SessionStatus;
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
    field: ListSessionsRequest.OrderByField
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
   * Add or replace a filter field to the state
   *
   * @param filterValue
   */
  private _filterState(filterProperty: string, filterValue: string): void {
    if (this._state.filters) {
      const res = this._state.filters.findIndex(
        (e) => e.property === filterProperty
      );
      if (res !== -1) {
        this._state.filters[res].value = filterValue;
      } else {
        this._state.filters.push({
          property: filterProperty,
          value: filterValue,
        });
      }
    } else {
      this._state.filters = [];
      this._state.filters.push({
        property: filterProperty,
        value: filterValue,
      });
    }
  }

  /**
   * Remove all status filters from the state
   *
   * @param statusFilters
   */
  private _removeStatusFilters(): void {
    this._state.filters = this._state.filters?.filter(
      (filter) => filter.property !== 'status'
    );
  }

  /**
   * Add status filter to the state
   *
   * @param statusFilters
   */
  private _addStatusFilters(statusFilters: string[]): void {
    if (!this._state.filters) {
      this._state.filters = [];
    }
    statusFilters.forEach((filter) => {
      this._state.filters?.push({ property: 'status', value: filter });
    });
  }

  /**
   * List sessions
   *
   * @returns Observable<ListSessionsResponse>
   */
  private _listSessions$(): Observable<ListSessionsResponse> {
    const params = this._grpcPagerService.createParams(this._restoreState());

    return this._grpcSessionsService.list$(params).pipe(
      catchError((error: Error) => {
        console.error(error);
        this.stopInterval();

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

  getFilterValue(key: object): void {
    console.log(key);
  }
}
