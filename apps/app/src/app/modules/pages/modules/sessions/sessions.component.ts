import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  AppError,
  Session,
  TitleService,
  SessionsService,
} from '../../../core/';

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
    private titleService: TitleService,
    private translateService: TranslateService,
    private sessionsService: SessionsService
  ) {
    this.titleService.setTitle(this.translateService.instant('sessions.title'));
  }

  /**
   * Used to get the list of sessions from the api using pagination for the datagrid and refresh the datagrid
   */
  refresh(state: ClrDatagridStateInterface) {
    const nextPage = state?.page?.current ?? 1;
    const limit = state?.page?.size ?? 10;

    this.sessionsService
      .getAllPaginated(this.appName, nextPage, limit)
      .subscribe({
        error: this.onErrorSessions.bind(this),
        next: this.onNextSessions.bind(this),
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
  get appName(): string {
    return this.route.snapshot.paramMap.get('application') ?? '';
  }

  /**
   * handle error when loading sessions
   */
  private onErrorSessions(error: AppError) {
    this.errors.push(error);
    this.loadingSessions = false;
  }

  /**
   * handle next when loading sessions
   */
  private onNextSessions(data: Pagination<Session>) {
    this.sessions = data;
    this.loadingSessions = false;
  }

  /**
   * Used to track session for ngFor
   */
  trackBySession(_: number, session: Session): string {
    return session._id;
  }
}
