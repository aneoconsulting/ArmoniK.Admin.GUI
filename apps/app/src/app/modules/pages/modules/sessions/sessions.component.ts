import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SessionsService } from '../../../core/services/http/sessions.service';
import { TitleService } from '../../../core/services/title.service';
import { AppError, Session } from '@armonik.admin.gui/armonik-typing';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent implements OnInit {
  sessions: Session[] = [];
  errors: AppError[] = [];
  loading = true;

  constructor(
    private titleService: TitleService,
    private translateService: TranslateService,
    private sessionsService: SessionsService
  ) {
    this.titleService.setTitle(this.translateService.instant('sessions.title'));
  }

  ngOnInit(): void {
    this.sessionsService.index().subscribe({
      error: (error: AppError) => {
        this.errors.push(error);
        this.loading = false;
      },
      next: (sessions) => {
        this.sessions = sessions;
        this.loading = false;
      },
    });
  }

  getSessionActionTitle(session: Session): string {
    if (session.closed) {
      return this.translateService.instant('sessions.table.actions.reopen');
    }
    return this.translateService.instant('sessions.table.actions.close');
  }

  trackBySession(_: number, session: Session): string {
    return session.id;
  }

  onSessionAction(data: Session): void {
    this.sessions = this.sessions.map((session) => {
      if (session.id === data.id) return data;
      return session;
    });
  }

  onSessionActionError(error: AppError): void {
    this.errors.push(error);
  }
}
