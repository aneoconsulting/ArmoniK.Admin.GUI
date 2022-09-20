import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, RawSession } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { AutoRefreshService } from '../../../../../shared';
import {
  TasksService,
  AppError,
  BrowserTitleService,
  LanguageService,
  PagerService,
  SettingsService,
} from '../../../../../core';
import { StatesService } from '../../../../../shared';
import { Subscription } from 'rxjs';
import { SessionRaw } from 'apps/app/src/app/core/types/proto/sessions-common.pb';
import {
  ListTasksResponse,
  Task,
} from 'apps/app/src/app/core/types/proto/tasks-common.pb';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
  providers: [AutoRefreshService],
})
export class SessionDetailComponent implements OnInit, OnDestroy {
  tasksSubscription = new Subscription();

  session?: SessionRaw;

  errors: AppError[] = [];

  // selectedTasks: Task[] = [];

  private state: ClrDatagridStateInterface = {};
  loadingTasks = true;
  tasksResponse: ListTasksResponse | null = null;

  cancelTasksButtonState = ClrLoadingState.DEFAULT;

  constructor(
    private route: ActivatedRoute,
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService,
    private tasksService: TasksService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private settingsService: SettingsService,
    public autoRefreshService: AutoRefreshService
  ) {
    // Activate auto refresh
    this.autoRefreshService.setFn(() => this.refresh());
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data['session']) {
        this.session = data['session'].session;
      }
    });

    this.browserTitleService.setTitle(
      this.languageService.instant('pages.sessions.session-detail.tab_title', {
        id: this.sessionId,
      })
    );
  }

  ngOnDestroy() {
    this.tasksSubscription.unsubscribe();
  }

  get tasksStateKey(): string {
    return ['tasks', this.sessionId].join('-');
  }

  get isSeqUp(): boolean {
    return this.settingsService.isSeqUp();
  }

  /**
   * Redirect to Seq
   *
   * @param taskId Task ID
   *
   * @returns URL
   */
  redirectToSeq(taskId: string) {
    window.open(
      this.settingsService.generateSeqUrlForTaskError(taskId),
      '_blank'
    );
  }

  /**
   * Used to get the list of tasks from the api using pagination for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  onRefreshTasks(state: ClrDatagridStateInterface) {
    this.loadingTasks = true;

    // Stop current request to avoid multiple requests at the same time
    this.tasksSubscription.unsubscribe();

    // Store the current state to be saved when the request completes or for manual and auto refresh
    this.state = state;

    const data = {
      sessionId: this.sessionId,
    };
    const params = this.pagerService.createHttpParams(state, data);

    this.tasksSubscription = this.tasksService.list(params).subscribe({
      error: this.onErrorTasks.bind(this),
      next: this.onNextTasks.bind(this),
    });
  }

  /**
   * Refresh
   */
  refresh() {
    this.onRefreshTasks(this.state);
  }

  /**
   * Used to cancel a list of task
   *
   * @param tasks Tasks to cancel
   */
  onCancelTasks() {
    this.cancelTasksButtonState = ClrLoadingState.LOADING;
    // this.tasksService.cancelMany(this.selectedTasks).subscribe({
    //   error: this.onErrorCancelTasks.bind(this),
    //   next: this.onNextCancelTasks.bind(this),
    // });
  }

  /**
   * Handle the error when getting tasks
   *
   * @param error Error
   */
  private onErrorTasks(error: AppError) {
    this.errors.push(error);
    this.loadingTasks = false;
  }

  /**
   * Handle tasks when getting them
   *
   * @param tasks Tasks
   */
  private onNextTasks(data: ListTasksResponse) {
    this.statesService.saveState(this.tasksStateKey, this.state);
    this.tasksResponse = data;
    console.log('tasksResponse', this.tasksResponse);
    this.loadingTasks = false;
  }

  /**
   * Handle the error when cancelling tasks
   *
   * @param error Error
   */
  private onErrorCancelTasks(error: AppError) {
    this.errors.push(error);
    this.cancelTasksButtonState = ClrLoadingState.DEFAULT;
  }

  /**
   * Handle the success when cancelling tasks
   *
   * @param tasks Tasks
   */
  private onNextCancelTasks() {
    this.cancelTasksButtonState = ClrLoadingState.SUCCESS;
    // this.selectedTasks = [];
  }

  get tasks(): Task[] {
    return this.tasksResponse?.tasks || [];
  }

  /**
   * Return the current session id from the route
   *
   * @returns Id of the session
   */
  get sessionId(): string {
    return this.route.snapshot.paramMap.get('session') ?? '';
  }

  /**
   * Return the current application name from the route
   *
   * @returns Name of the application
   */
  get applicationName(): string {
    return this.route.snapshot.paramMap.get('applicationName') ?? '';
  }

  /**
   * Return the current application version from the route
   *
   * @returns Version of the application
   */
  get applicationVersion(): string {
    return this.route.snapshot.paramMap.get('applicationVersion') ?? '';
  }
}
