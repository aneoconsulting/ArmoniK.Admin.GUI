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
  LanguageService,
  SettingsService,
} from '../../../core';
import { GrpcApplicationsService } from '../../../core/services/grpc/grpc-applications.service';
import {
  ListApplicationsRequest,
  ListApplicationsResponse,
} from '../../../core/types/proto/applications-common.pb';

@Component({
  selector: 'app-pages-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss'],
})
export class ApplicationsListComponent implements OnInit {
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

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _languageService: LanguageService,
    private _settingsService: SettingsService,
    private _grpcApplicationsService: GrpcApplicationsService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle(
      this._languageService.instant('applications.title')
    );
  }

  public get OrderByField() {
    return ListApplicationsRequest.OrderByField;
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
   * List applications
   *
   * @returns Observable<ListApplicationsResponse>
   */
  private _listApplications$(): Observable<ListApplicationsResponse> {
    const params = this._grpcPagerService.createParams(this._restoreState());

    return this._grpcApplicationsService.list$(params).pipe(
      catchError((error) => {
        console.error(error);
        this.stopInterval();

        return of({} as ListApplicationsResponse);
      }),
      tap((applications) => {
        this.loadingApplications$.next(false);
        this.totalApplications$.next(applications.total ?? 0);
      })
    );
  }
}
