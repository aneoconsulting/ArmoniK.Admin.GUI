import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, RawSession } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface, ClrLoadingState } from '@clr/angular';
import { AutoRefreshService } from '../../../../../shared';
import {
  TasksService,
  Task,
  AppError,
  BrowserTitleService,
  LanguageService,
  PagerService,
  SettingsService,
} from '../../../../../core';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
  providers: [AutoRefreshService],
})
export class SessionDetailComponent implements OnInit {
  // Store state for manual and auto refresh
  private state: ClrDatagridStateInterface = {};

  session?: RawSession;

  tasks: Pagination<Task> | null = null;
  selectedTasks: Task[] = [];
  cancelTasksButtonState = ClrLoadingState.DEFAULT;
  loadingTasks = true;

  errors: AppError[] = [];

  constructor(
    private route: ActivatedRoute,
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService,
    private tasksService: TasksService,
    private pagerService: PagerService,
    private settingsService: SettingsService,
    public autoRefreshService: AutoRefreshService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.sessions.session-detail.title')
    );

    // Activate auto refresh
    this.autoRefreshService.setFn(() => this.refresh());
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data['session']) {
        this.session = data['session'];
      }
    });
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
  refresh(state?: ClrDatagridStateInterface) {
    if (state) {
      // save the state
      this.state = state;
    } else {
      // set the state to the last one
      state = this.state;
    }

    this.loadingTasks = true;

    const data = {
      sessionId: this.sessionId,
    };
    const params = this.pagerService.createHttpParams(state, data);

    this.tasksService.getAllPaginated(params).subscribe({
      error: this.onErrorTasks.bind(this),
      next: this.onNextTasks.bind(this),
    });
  }

  /**
   * Used to cancel a list of task
   *
   * @param tasks Tasks to cancel
   */
  onCancelTasks() {
    this.cancelTasksButtonState = ClrLoadingState.LOADING;
    this.tasksService.cancelMany(this.selectedTasks).subscribe({
      error: this.onErrorCancelTasks.bind(this),
      next: this.onNextCancelTasks.bind(this),
    });
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
  private onNextTasks(tasks: Pagination<Task>) {
    this.tasks = tasks;
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
    this.selectedTasks = [];
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
