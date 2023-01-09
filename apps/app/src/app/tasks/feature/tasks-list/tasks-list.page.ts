import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CancelTasksResponse,
  GetTaskResponse,
  GrpcPagerService,
  ListTasksRequest,
  ListTasksResponse,
  TaskStatus,
  TaskSummary,
} from '@armonik.admin.gui/shared/data-access';
import { DisabledIntervalValue } from '@armonik.admin.gui/shared/feature';
import { GrpcTasksService } from '@armonik.admin.gui/tasks/data-access';
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

@Component({
  selector: 'app-pages-tasks-list',
  templateUrl: './tasks-list.page.html',
  styleUrls: ['./tasks-list.page.scss'],
})
export class TasksListComponent implements OnInit {
  private _state: ClrDatagridStateInterface = {};

  /** Get tasks */
  private _subjectManual = new Subject<void>();
  private _subjectDatagrid = new Subject<ClrDatagridStateInterface>();
  private _intervalValue = new Subject<number>();
  private _stopInterval = new Subject<void>();
  public stopInterval$ = this._stopInterval.asObservable();

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
          relativeTo: this._activatedRoute,
        });
        return state;
      })
    );
  private _triggerInterval$: Observable<number> = this._intervalValue
    .asObservable()
    .pipe(
      switchMap((time) => timer(0, time).pipe(takeUntil(this.stopInterval$)))
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

  taskStatusList: { value: number; label: string }[];

  /**
   * Filters observables.
   * We are not using the queryParam functions because they are called in a infinite loop with the async pipe.
   */
  filterTaskId: string = this._settingsService.queryStringParam(
    this._activatedRoute.snapshot.queryParams,
    'taskId'
  );

  filterSessionId: string = this._settingsService.queryStringParam(
    this._activatedRoute.snapshot.queryParams,
    'sessionId'
  );

  filterStatus: number = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'status'
  );

  filterCreatedBefore: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdAtBefore'
  );

  filterCreatedAfter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'createdAtAfter'
  );

  filterStartedBefore: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'startedAtBefore'
  );

  filterStartedAfter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'startedAtAfter'
  );

  filterEndedBefore: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'endedAtBefore'
  );

  filterEndedAfter: Date | null = this._settingsService.queryDateParam(
    this._activatedRoute.snapshot.queryParams,
    'endedAtAfter'
  );

  pageSize: number = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'pageSize'
  );
  page: number = this._settingsService.queryParam(
    this._activatedRoute.snapshot.queryParams,
    'page'
  );

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _settingsService: SettingsService,
    private _grpcTasksService: GrpcTasksService,
    private _grpcPagerService: GrpcPagerService
  ) {}

  ngOnInit(): void {
    this.taskStatusList = [
      ...Object.keys(TaskStatus)
        .filter((key) => !Number.isInteger(parseInt(key)))
        .map((key) => ({
          value: TaskStatus[key as keyof typeof TaskStatus],
          label: key,
        })),
    ];
  }

  public get OrderByField(): typeof ListTasksRequest.OrderByField {
    return ListTasksRequest.OrderByField;
  }

  public get TaskStatusEnum(): typeof TaskStatus {
    return TaskStatus;
  }

  public get isSeqUp$(): Observable<boolean> {
    return this._settingsService.seqSubject$.asObservable();
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

  public onUpdateInterval(value: number) {
    this._intervalValue.next(value);

    // Stop interval
    if (value === DisabledIntervalValue) {
      this._stopInterval.next();
    }
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
    const urlParams = this._grpcPagerService.createParams(this._restoreState());
    const grpcParams = this._grpcTasksService.urlToGrpcParams(urlParams);
    return this._grpcTasksService.list$(grpcParams).pipe(
      catchError((error) => {
        console.error(error);
        this._stopInterval.next();

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
