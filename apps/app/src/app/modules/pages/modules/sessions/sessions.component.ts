import { Component } from '@angular/core';
import { Session } from '../../../core/entities';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  sessions: Session[] = [
    {
      id: 1,
    },
    {
      id: 2,
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ];

  trackBySession(_: number, session: Session): number {
    return session.id;
  }
}
