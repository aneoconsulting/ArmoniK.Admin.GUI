import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import {
  BehaviorSubject,
  catchError,
  concatMap,
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
  LanguageService,
  SettingsService,
} from '../../../core';
import { GrpcTasksService } from '../../../core/services/grpc/grpc-tasks.service';
import { TaskStatus } from '../../../core/types/proto/task-status.pb';
import {
  GetTaskResponse,
  ListTasksResponse,
  CancelTasksResponse,
  TaskSummary,
  ListTasksRequest,
} from '../../../core/types/proto/tasks-common.pb';

@Component({
  selector: 'app-pages-tasks-list',
  templateUrl: './tasks-list.component.html',
  styleUrls: ['./tasks-list.component.scss'],
})
export class TasksListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};

  /** Get tasks */
  private _subjectManual: Subject<void> = new Subject<void>();
  private _subjectDatagrid: Subject<ClrDatagridStateInterface> =
    new Subject<ClrDatagridStateInterface>();
  private _subjectInterval: BehaviorSubject<number> =
    new BehaviorSubject<number>(10_000);
  private _subjectStopInterval: Subject<void> = new Subject<void>();

  /** Triggers to reload tasks */
  private _triggerManual$: Observable<void> =
    this._subjectManual.asObservable();
  private _triggerDatagrid$: Observable<ClrDatagridStateInterface> =
    this._subjectDatagrid.asObservable().pipe(
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
  private _triggerInterval$: Observable<number> = this.subjectInterval
    .asObservable()
    .pipe(
      switchMap((time) =>
        interval(time).pipe(takeUntil(this._subjectStopInterval.asObservable()))
      )
    );

  loadingTasks$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  totalTasks$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  loadTasks$: Observable<ListTasksResponse> = merge(
    this._triggerManual$,
    this._triggerDatagrid$,
    this._triggerInterval$
  ).pipe(
    tap(() => this.loadingTasks$.next(true)),
    switchMap(() => this._listTasks$())
  );

  /** Get a single task */
  private _opened$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private _subjectSingleTask: Subject<string> = new Subject<string>();
  private _triggerSingleTask: Observable<string> =
    this._subjectSingleTask.asObservable();

  loadingSingleTask$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  loadSingleTask$ = this._triggerSingleTask.pipe(
    tap((taskId) => this.loadingSingleTask$.next(taskId)),
    switchMap((taskId) => this._getTask$(taskId))
  );

  /** Cancel many tasks */
  selected: TaskSummary[] = [];
  loadingCancelTasks$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _browserTitleService: BrowserTitleService,
    private _languageService: LanguageService,
    private _settingsService: SettingsService,
    private _grpcTasksService: GrpcTasksService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this._browserTitleService.setTitle(
      this._languageService.instant('pages.tasks-list.title')
    );
  }

  public get OrderByField(): typeof ListTasksRequest.OrderByField {
    return ListTasksRequest.OrderByField;
  }

  public get TaskStatusEnum(): typeof TaskStatus {
    return TaskStatus;
  }

  public get isSeqUp$() {
    return this._settingsService.seqSubject$.asObservable();
  }

  public get subjectInterval(): BehaviorSubject<number> {
    return this._subjectInterval;
  }

  public get intervals(): number[] {
    return this._settingsService.intervals;
  }

  public get initialInterval(): number {
    return this._settingsService.initialInterval;
  }

  public generateSeqUrl(taskId: string): string {
    return this._settingsService.generateSeqUrl({
      filter: `taskId='${taskId}'`,
    });
  }

  public isCompleted(task: TaskSummary): boolean {
    return task.status === TaskStatus.TASK_STATUS_COMPLETED;
  }

  public defaultSortOrder(
    field: ListTasksRequest.OrderByField
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
   * Refresh manually tasks without a new state
   *
   * @returns void
   */
  public manualRefreshTasks(): void {
    this._subjectManual.next();
  }

  /**
   *  Get a single task
   *
   * @param taskId
   */
  public viewTaskDetail(taskId: string): void {
    this._subjectSingleTask.next(taskId);
  }

  /**
   * Open modal to view details
   */
  public openGetTaskModal(): void {
    this._opened$.next(true);
  }

  /**
   * Close modal to view details
   */
  public closeGetTaskModal(): void {
    this._opened$.next(false);
  }

  public get isGetTaskModalOpened$(): Observable<boolean> {
    return this._opened$.asObservable();
  }

  /*
   *  Cancel many tasks
   */
  public cancelSelection(): void {
    this.loadingCancelTasks$.next(true);

    const selectionIds = this.selected.map((value) => value.id ?? '');
    this._cancelTasks$(selectionIds)
      .pipe(first())
      .subscribe({
        complete: () => this.manualRefreshTasks(),
      });
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
   * Track by task
   *
   * @param _
   * @param task
   *
   * @returns Id
   */
  public trackByTask(_: number, task: TaskSummary): string {
    return task.id ?? '';
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

    return this._grpcTasksService.list$(params).pipe(
      catchError((error) => {
        console.error(error);
        this.stopInterval();

        return of({} as ListTasksResponse);
      }),
      tap((tasks) => {
        this.loadingTasks$.next(false);
        this.totalTasks$.next(tasks.total ?? 0);
      })
    );
  }

  /**
   * Get single task
   *
   * @returns Observable<GetTaskResponse>
   */
  private _getTask$(taskId: string): Observable<GetTaskResponse> {
    return this._grpcTasksService.get$(taskId).pipe(
      catchError((error: Error) => {
        console.error(error);

        return of({} as GetTaskResponse);
      }),
      tap(() => {
        this.openGetTaskModal();
        this.loadingSingleTask$.next(null);
      })
    );
  }

  private _cancelTasks$(taskIds: string[]): Observable<CancelTasksResponse> {
    return this._grpcTasksService.cancel$(taskIds).pipe(
      catchError((error: Error) => {
        console.error(error);

        return of({} as CancelTasksResponse);
      }),
      tap(() => this.loadingCancelTasks$.next(false))
    );
  }
}
