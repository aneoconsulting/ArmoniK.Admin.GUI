import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
    private router: Router,
    private browserTitleService: BrowserTitleService,
    private languageService: LanguageService,
    private sessionsService: SessionsService
  ) {
    this.browserTitleService.setTitle(
      this.applicationName + ' - ' + this.applicationVersion
    );

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.refresh({});
        this.browserTitleService.setTitle(
          this.applicationName + ' - ' + this.applicationVersion
        );
      }
    });
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
      .getAllPaginated(
        {
          applicationName: this.applicationName,
          applicationVersion: this.applicationVersion,
        },
        nextPage,
        limit
      )
      .subscribe({
        error: this.onErrorSessions.bind(this),
        next: this.onNextSessions.bind(this),
      });
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
  private onNextSessions(data: Pagination<Session>) {
    this.sessions = data;
    this.loadingSessions = false;
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
