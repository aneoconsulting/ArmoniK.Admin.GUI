import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TitleService } from '../../../core/services/';

@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private titleService: TitleService,
    private translateService: TranslateService
  ) {
    this.titleService.setTitle(
      this.translateService.instant('dashboard.title')
    );
  }
}
