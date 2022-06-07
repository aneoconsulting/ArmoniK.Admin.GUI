import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  AppError,
  BrowserTitleService,
  LanguageService,
  Session,
  SessionsService,
} from '../../../core';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  sessions: Pagination<Session> | null = null;
  errors: AppError[] = [];
  loadingSessions = true;

  constructor(
    private route: ActivatedRoute,
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService,
    private sessionsService: SessionsService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.sessions.title')
    );
  }

  /**
   * Used to get the list of sessions from the api using pagination for the datagrid and refresh the datagrid
   *
   * @param state
   */
  refresh(state: ClrDatagridStateInterface) {
    const nextPage = state?.page?.current ?? 1;
    const limit = state?.page?.size ?? 10;

    this.loadingSessions = true;

    this.sessionsService
      .getAllPaginated(this.applicationName, nextPage, limit)
      .subscribe({
        error: this.onErrorSessions.bind(this),
        next: this.onNextSessions.bind(this),
      });
  }

  /**
   * Cancel a session
   *
   * @param session
   */
  cancelSession(sessionId: Session['_id']) {
    this.sessionsService.cancel(sessionId).subscribe({
      error: this.onCancelSessionError.bind(this),
    });
  }

  /**
   * Return total number of sessions even if there is no session (return 0)
   */
  get totalSessions(): number {
    return this.sessions ? this.sessions.meta.total : 0;
  }

  /**
   * Return the current application name from the route
   */
  get applicationName(): string {
    return this.route.snapshot.paramMap.get('application') ?? '';
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
  private onNextSessions(data: Pagination<Session>) {
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
  trackSessions(_: number, session: Session): Session['_id'] {
    return session._id;
  }
}
