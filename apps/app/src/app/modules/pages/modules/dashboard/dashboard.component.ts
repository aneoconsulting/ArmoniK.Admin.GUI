import { Component } from '@angular/core';
import { TitleService } from '../../../core/title.service';

@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private titleService: TitleService) {
    this.titleService.setTitle('Dashboard');
  }
}
