import { Component, OnInit } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService, TitleService } from '../../../core/services/';

@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(
    private titleService: TitleService,
    private translateService: TranslateService,
    private appSettingsService: AppSettingsService
  ) {
    this.titleService.setTitle(
      this.translateService.instant('dashboard.title')
    );
  }

  get activeApplication(): Application | null {
    return this.appSettingsService.activeApplication;
  }
}
