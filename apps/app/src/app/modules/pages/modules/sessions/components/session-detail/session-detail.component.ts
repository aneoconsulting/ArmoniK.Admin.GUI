import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pages-sessions-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.scss'],
})
export class SessionDetailComponent {
  constructor(private route: ActivatedRoute) {}

  getSessionId() {
    return this.route.snapshot.paramMap.get('id');
  }
}
