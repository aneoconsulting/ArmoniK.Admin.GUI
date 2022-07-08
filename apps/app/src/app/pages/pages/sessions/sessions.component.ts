import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormattedSession,
  Pagination,
  SessionStatus,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  AppError,
  BrowserTitleService,
  LanguageService,
  Session,
  SessionsService,
} from '../../../core';
import { AutoRefreshService } from '../../../shared';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  providers: [AutoRefreshService],
})
export class SessionsComponent implements OnInit {
  // Store state for manual and auto refresh
  private state: ClrDatagridStateInterface = {};

  sessions: Pagination<FormattedSession> | null = null;
  errors: AppError[] = [];
  loadingSessions = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private browserTitleService: BrowserTitleService,
    private sessionsService: SessionsService,
    private languageService: LanguageService,
    public autoRefreshService: AutoRefreshService
  ) {}

  ngOnInit(): void {
    this.browserTitleService.setTitle(
      this.applicationName + ' - ' + this.applicationVersion
    );
    // Activate auto refresh
    this.autoRefreshService.setFn(() => this.refresh());
  }

  /**
   * Used to get the list of sessions from the api using pagination for the datagrid and refresh the datagrid
   *
   * @param state
   */
  onRefreshSessions(state: ClrDatagridStateInterface) {
    this.state = state;

    this.loadingSessions = true;

    const nextPage = state?.page?.current ?? 1;
    const limit = state?.page?.size ?? 10;

    let params = new HttpParams()
      .set('page', nextPage.toString())
      .set('limit', limit.toString())
      .set('applicationName', this.applicationName)
      .set('applicationVersion', this.applicationVersion);

    const orderBy = state?.sort?.by as string;
    const order = state?.sort?.reverse ? -1 : 1;
    if (orderBy) {
      params = params.set('orderBy', orderBy).set('order', order);
    }

    const filters = state?.filters;
    if (filters) {
      // filters is an array of filter
      for (const filter of filters) {
        const filterName = filter.property as string;
        const filterValue = filter.value as string;
        params = params.set(filterName, filterValue);
      }
    }

    this.sessionsService.getAllPaginated(params).subscribe({
      error: this.onErrorSessions.bind(this),
      next: this.onNextSessions.bind(this),
    });
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
   * Cancel a session
   *
   * @param session
   */
  cancelSession(sessionId: Session['_id']) {
    // Use an alert to confirm the cancellation
    if (
      confirm(this.languageService.instant('pages.sessions.cancel.confirm'))
    ) {
      this.sessionsService.cancel(sessionId).subscribe({
        error: this.onCancelSessionError.bind(this),
      });
    }
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
    return this.route.snapshot.paramMap.get('applicationName') ?? '';
  }

  /**
   * Return the current application version from the route
   *
   * @returns application version
   *
   */
  get applicationVersion(): string {
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
    this.sessions = data;
    this.loadingSessions = false;
  }

  /**
   * Handle error when cancelling a session
   *
   * @param error
   */
  private onCancelSessionError(error: AppError) {
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
