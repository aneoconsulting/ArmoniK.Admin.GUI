import { Component } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { TranslateService } from '@ngx-translate/core';
import { Session } from '../../../core/';
import { TitleService } from '../../../core/';

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
      _id: 'e297367f-cd8f-44bb-8cb0-497c5fbe5ba5',
      Status: 'Running',
    },
    {
      _id: 'daeb8483-a0a0-4f07-ac08-115f49fac660',
      Status: 'Running',
    },
    {
      _id: 'dbf6a5d0-ebd0-42b7-be4f-936bcf30b3ec',
      Status: 'Running',
    },
    {
      _id: '45469ed3-1891-4366-b598-cbdc45c3056d',
      Status: 'Processing',
    },
    {
      _id: 'bf225c79-ae07-4e87-8fb4-33a0798950a5',
      Status: 'Running',
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

  trackBySession(_: number, session: Session): string {
    return session._id;
  }

  refresh(state: ClrDatagridStateInterface) {
    // TODO: refresh using state (gui-sessions)
  }
}
