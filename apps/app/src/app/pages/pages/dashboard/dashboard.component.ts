import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs';
import {
  AppError,
  ApplicationsService,
  BrowserTitleService,
  LanguageService,
  PagerService,
  SettingsService,
  TasksService,
} from '../../../core';
import { TaskStatus } from '../../../core/types/proto/task-status.pb';
import {
  ListTasksRequest,
  ListTasksResponse,
} from '../../../core/types/proto/tasks-common.pb';
import { StatesService } from '../../../shared';

/**
 *  Display the dashboard
 */
@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  tasksErrorsSubscription = new Subscription();
  subscriptions: Subscription = new Subscription();

  applications: Application[] = [];

  errors: AppError[] = [];

  tasksErrorsStateKey = 'tasks-errors';
  private state: ClrDatagridStateInterface = {};
  tasksErrorsLoading = true;
  tasksErrorsResponse: ListTasksResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    private settingsService: SettingsService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private applicationsService: ApplicationsService,
    private tasksService: TasksService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.dashboard.title')
    );

    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        if (data['applications']) {
          this.applications = data['applications'];
        }
      })
    );
  }

  ngOnDestroy() {
    this.tasksErrorsSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
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
   * Used to get the list of application errors from the api
   * using pagination for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  onRefreshTasksErrors(state: ClrDatagridStateInterface) {
    this.tasksErrorsLoading = true;

    // Stop current request to avoid multiple requests at the same time
    this.tasksErrorsSubscription.unsubscribe();

    // Force status to be error
    if (!state.filters) {
      state.filters = [];
    }

    state.filters.push({
      property: ListTasksRequest.OrderByField.ORDER_BY_FIELD_STATUS,
      value: TaskStatus.TASK_STATUS_ERROR,
    });

    this.state = state;

    // Store the current state to be saved when the request completes
    const params = this.pagerService.createHttpParams(state);

    console.log(params);

    this.tasksErrorsSubscription = this.tasksService.list(params).subscribe({
      error: this.onErrorTasksErrors.bind(this),
      next: this.onNextTasksErrors.bind(this),
    });
    // Refresh the datagrid
    this.cdr.detectChanges();
  }

  /**
   * Update application on application click
   *
   * @param applicationId
   */
  onApplicationClick(application: Application) {
    this.settingsService.addCurrentApplication(application);

    this.router.navigate([
      '/',
      'applications',
      application._id.applicationName,
      application._id.applicationVersion,
      'sessions',
    ]);
  }

  /**
   * Used to track application for ngFor
   *
   * @param index
   * @param application
   *
   * @returns value
   */
  trackByApplication(_: number, application: Application): Application['_id'] {
    return application._id;
  }

  /**
   * Handle the error when getting applications
   *
   * @param error Error
   */
  private onErrorTasksErrors(error: AppError) {
    this.tasksErrorsLoading = false;
    this.errors.push(error);
  }

  /**
   * Handle applications when getting them
   *
   * @param applications Applications
   */
  private onNextTasksErrors(data: ListTasksResponse) {
    this.statesService.saveState(this.tasksErrorsStateKey, this.state);
    this.tasksErrorsLoading = false;
    this.tasksErrorsResponse = data;
  }
}
