import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../../core/entities';
import { SessionsService } from '../../../core/services/http/sessions.service';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  sessions: Session[] = [
    {
      id: '9a65ae05-50f6-47b3-811d-51c8b27dda72',
      closed: false,
    },
    {
      id: '342e1b4c-15ba-4cfa-89f6-81f30fd5dfac',
      closed: false,
    },
    {
      id: 'ef91ba10-afd9-4a86-b9cc-65b5fe8d0a4d',
      closed: false,
    },
    {
      id: 'c4f927f3-5d82-48c3-a710-1f7fbb071940',
      closed: true,
    },
    {
      id: 'fabc0901-d8d1-4815-af76-71d7674f6cab',
      closed: false,
    },
  ];

  constructor(
    private titleService: TitleService,
    private translateService: TranslateService,
    private sessionsService: SessionsService
  ) {
    this.titleService.setTitle(this.translateService.instant('sessions.title'));
  }

  getSessionActionTitle(session: Session): string {
    if (session.closed) {
      return this.translateService.instant('sessions.table.action.reopen');
    }
    return this.translateService.instant('sessions.table.action.close');
  }

  trackBySession(_: number, session: Session): string {
    return session.id;
  }

  // Gérer les types de données pour rendre cela plus propore
  onSessionAction(data: any) {
    console.log(data);
    // find the session in the list and update it
    this.sessions = this.sessions.map((session) => {
      if (session.id === data.id) {
        return {
          ...session,
          closed: data.cancelled,
        };
      }
      return session;
    });
  }
}
