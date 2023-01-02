import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcSessionsService } from '@armonik.admin.gui/sessions/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import {
  GetSessionResponse,
  GrpcPagerService,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionStatus,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  distinctUntilChanged,
  first,
  map,
  merge,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
import { BrowserTitleService } from '../../../shared/util';

@Component({
  selector: 'app-pages-sessions-list',
  templateUrl: './sessions-list.page.html',
  styleUrls: ['./sessions-list.page.scss'],
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
  private _intervalValue = new Subject<number>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

  /** Triggers to reload sessions */
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
  private _triggerInterval$ = this._intervalValue
    .asObservable()
    .pipe(
      switchMap((time) => timer(0, time).pipe(takeUntil(this.stopInterval$)))
    );

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

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _grpcSessionsService: GrpcSessionsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle($localize`Sessions`);
  }

  public get OrderByField() {
    return ListSessionsRequest.OrderByField;
  }

  public get SessionStatusEnum() {
    return SessionStatus;
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
    this._intervalValue.next(value);

    // Stop interval
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
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
   * List sessions
   *
   * @returns Observable<ListSessionsResponse>
   */
  private _listSessions$(): Observable<ListSessionsResponse> {
    const urlParams = this._grpcPagerService.createParams(this._restoreState());
    const grpcParams = this._grpcSessionsService.urlToGrpcParams(urlParams);
    return this._grpcSessionsService.list$(grpcParams).pipe(
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
    delete this._state.filters;
    this._subjectDatagrid.next(this._state);
  }
}
