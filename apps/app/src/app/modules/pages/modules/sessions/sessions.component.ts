import { Component } from '@angular/core';
import { Session } from '../../../core/entities';
import { TitleService } from '../../../core/services/title.service';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
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

  constructor(private titleService: TitleService) {
    this.titleService.setTitle('Sessions');
  }

  trackBySession(_: number, session: Session): number {
    return session.id;
  }
}
