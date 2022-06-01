import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { AppError, BrowserTitleService, LanguageService } from '../../../core';

/**
 *  Display the dashboard
 */
@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  applications: Application[] = [];

  constructor(
    private route: ActivatedRoute,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('dashboard.title')
    );
  }

  ngOnInit() {
    this.route.data.subscribe((data) => {
      if (data['applications']) {
        this.applications = data['applications'];
      }
    });
  }

  /**
   * Used to track application for ngFor
   *
   * @param index
   * @param application
   *
   * @returns value
   */
  trackByApplication(_: number, application: Application): Application['_id'] {
    return application._id;
  }
}
