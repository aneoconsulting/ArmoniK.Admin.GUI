import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridStateInterface } from '@clr/angular';
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
import { GrpcPagerService, SettingsService } from '../../../core';
import { GrpcTasksService } from '../../../core/services/grpc/grpc-tasks.service';
import { ListTasksResponse } from '../../../core/types/proto/tasks-common.pb';

@Component({
  selector: 'app-pages-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent {
  private _state: ClrDatagridStateInterface = {};

  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _subjectInterval = new BehaviorSubject<number>(10_000);
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

  loadingTasks$ = new BehaviorSubject<boolean>(true);
  totalTasks$ = new BehaviorSubject<number>(0);

  loadTasks$ = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingTasks$.next(true)),
    switchMap(() => this._listTasks$())
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _grpcTasksService: GrpcTasksService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  public get subjectInterval() {
    return this._subjectInterval;
  }

  public get intervals() {
    return this._settingsService.intervals;
  }

  public get initialInterval() {
    return this._settingsService.initialInterval;
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
   * Refresh tasks using a new state
   *
   * @param state
   *
   * @returns void
   */
  public refreshTasks(state: ClrDatagridStateInterface): void {
    this._subjectDatagrid.next(state);
  }

  /**
   * Refresh manually tasks using new state
   *
   * @returns void
   */
  public manualRefreshTasks(): void {
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
   * List tasks
   *
   * @returns Observable<ListTasksResponse>
   */
  private _listTasks$(): Observable<ListTasksResponse> {
    const params = this._grpcPagerService.createParams(this._restoreState());
    const httpParams = this._grpcPagerService.createHttpParams(params);
    return this._grpcTasksService.list$(httpParams).pipe(
      catchError((error) => {
        console.error(error);
        return of({} as ListTasksResponse);
      }),
      tap((tasks) => {
        this.loadingTasks$.next(false);
        this.totalTasks$.next(tasks.total ?? 0);
      })
    );
  }
}
