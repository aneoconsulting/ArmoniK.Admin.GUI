import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../../core/entities';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  total = 0;
  loading = true;

  sessions: Session[] = [
    {
      id: 1,
      closed: false,
    },
    {
      id: 2,
      closed: false,
    },
    {
      id: 3,
      closed: false,
    },
    {
      id: 4,
      closed: true,
    },
    {
      id: 5,
      closed: false,
    },
  ];

  constructor(
    private titleService: TitleService,
    private translateService: TranslateService
  ) {
    this.titleService.setTitle(this.translateService.instant('sessions.title'));
    this.total = this.sessions.length;
    this.loading = false;
  }

  trackBySession(_: number, session: Session): number {
    return session.id;
  }

  refresh(state: ClrDatagridStateInterface) {
    console.log(state);
  }
}
