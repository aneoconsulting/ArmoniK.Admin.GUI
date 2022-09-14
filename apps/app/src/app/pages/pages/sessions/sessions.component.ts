import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormattedSession,
  Pagination,
  SessionStatus,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from '@clr/angular';
import { Subscription } from 'rxjs';
import {
  AppError,
  BrowserTitleService,
  PagerService,
  Session,
  SessionsService,
} from '../../../core';
import { AutoRefreshService, StatesService } from '../../../shared';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  providers: [AutoRefreshService],
})
export class SessionsComponent implements OnInit, OnDestroy {
  sessionsSubscription = new Subscription();

  errors: AppError[] = [];

  private state: ClrDatagridStateInterface = {};
  loadingSessions = true;
  sessions: Pagination<FormattedSession> | null = null;

  sessionToCancel: FormattedSession | null = null;
  isModalOpen = false;

  constructor(
    private route: ActivatedRoute,
    private browserTitleService: BrowserTitleService,
    private sessionsService: SessionsService,
    private statesService: StatesService,
    private pagerService: PagerService,
    private cdr: ChangeDetectorRef,
    public autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.browserTitleService.setTitle(
      this.applicationName + ' - ' + this.applicationVersion
    );
    // Activate auto refresh
    this.autoRefreshService.setFn(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.sessionsSubscription.unsubscribe();
  }

  get sessionsStateKey(): string {
    return ['sessions', this.applicationName, this.applicationVersion].join(
      '-'
    );
  }

  /**
   * Get currant page
   *
   * @returns current page
   */
  get currentPage(): number {
    return this.statesService.getCurrentPage(this.sessionsStateKey);
  }

  /**
   * Get page size
   *
   * @returns page size
   */
  get pageSize(): number {
    return this.statesService.getPageSize(this.sessionsStateKey);
  }

  /**
   * Get filter value from the filters store
   *
   * @param key Key to find the filter value
   *
   * @returns filter value
   */
  getFilterValue(key: string): string {
    return this.statesService.getFilterValue(this.sessionsStateKey, key);
  }

  /**
   * Get sort order from the filters store
   *
   * @param key Key to find the sort order
   *
   * @returns sort order
   */
  getSortOrder(key: string): ClrDatagridSortOrder {
    return this.statesService.getSortOrder(this.sessionsStateKey, key);
  }

  /**
   * Delete state from the filters store
   *
   */
  deleteState() {
    this.state = {};
    this.statesService.deleteState(this.sessionsStateKey);
    this.refresh();
  }

  /**
   * Used to get the list of sessions from the api using pagination for the datagrid and refresh the datagrid
   *
   * @param state
   */
  onRefreshSessions(state: ClrDatagridStateInterface) {
    this.loadingSessions = true;

    // Stop current request to avoid multiple requests at the same time
    this.sessionsSubscription.unsubscribe();

    // Store the current state to be saved when the request completes or for manual and auto refresh
    this.state = state;

    const data = {
      applicationName: this.applicationName,
      applicationVersion: this.applicationVersion,
    };
    const params = this.pagerService.createHttpParams(state, data);

    this.sessionsSubscription = this.sessionsService
      .getAllPaginated(params)
      .subscribe({
        error: this.onErrorSessions.bind(this),
        next: this.onNextSessions.bind(this),
      });
    // Refresh the datagrid
    this.cdr.detectChanges();
  }

  /**
   * Refresh
   */
  refresh() {
    this.onRefreshSessions(this.state);
  }

  /**
   * Update the timer
   *
   * @param timer
   */
  onTimerChange(timer: number) {
    this.autoRefreshService.setTimer(timer);
  }

  /**
   * Confirm the cancellation of a session
   *
   * @param session
   */
  confirmCancelSession(session: FormattedSession) {
    this.isModalOpen = true;
    this.sessionToCancel = session;
  }

  /**
   * Cancel a session
   *
   * @param session
   */
  cancelSession(sessionId: Session['_id']) {
    this.sessionsService.cancel(sessionId);
  }

  /**
   * Check if a session is cancelled
   *
   * @param session
   * @returns true if the session is cancelled
   */
  isCancelled(session: FormattedSession): boolean {
    return session.status === SessionStatus.CANCELLED;
  }

  /**
   * Return total number of sessions even if there is no session (return 0)
   *
   * @returns total number of sessions
   */
  get totalSessions(): number {
    return this.sessions ? this.sessions.meta.total : 0;
  }

  /**
   * Return the current application name from the route
   *
   * @returns application name
   */
  get applicationName(): string {
    /* istanbul ignore next */
    return this.route.snapshot.paramMap.get('applicationName') ?? '';
  }

  /**
   * Return the current application version from the route
   *
   * @returns application version
   *
   */
  get applicationVersion(): string {
    /* istanbul ignore next */
    return this.route.snapshot.paramMap.get('applicationVersion') ?? '';
  }

  /**
   * Handle error when loading sessions
   *
   * @param error
   */
  private onErrorSessions(error: AppError) {
    this.errors.push(error);
    this.loadingSessions = false;
  }

  /**
   * Handle next when loading sessions
   *
   * @param data
   */
  private onNextSessions(data: Pagination<FormattedSession>) {
    this.statesService.saveState(this.sessionsStateKey, this.state);
    this.sessions = data;
    this.loadingSessions = false;
  }

  /**
   * Handle next response when loading sessions
   */
  private onCancelSessionNext() {
    this.sessionToCancel = null;
    this.isModalOpen = false;
  }

  /**
   * Handle error when cancelling a session
   *
   * @param error
   */
  private onCancelSessionError(error: AppError) {
    this.sessionToCancel = null;
    this.isModalOpen = false;

    this.errors.push(error);
  }

  /**
   * Track sessions by id
   *
   * @param _
   * @param session
   *
   * @returns session id
   */
  trackSessions(_: number, session: FormattedSession): FormattedSession['_id'] {
    return session._id;
  }
}
