import { Component } from '@angular/core';
import { TitleService } from '../../../core/title.service';

@Component({
  selector: 'app-pages-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
})
export class SessionsComponent {
  constructor(private titleService: TitleService) {
    this.titleService.setTitle('Sessions');
  }
}
