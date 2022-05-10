import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '../../../../../core/services/';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
})
export class SessionDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService
  ) {
    this.titleService.setTitle('Session Detail');
  }

  getSessionId() {
    return this.route.snapshot.paramMap.get('id');
  }
}
