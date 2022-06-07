import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import {
  BrowserTitleService,
  LanguageService,
  SettingsService,
} from '../../../core';

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
    private router: Router,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    private settingsService: SettingsService
  ) {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.dashboard.title')
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
   * Update application on application click
   *
   * @param applicationId
   */
  onApplicationClick(application: Application) {
    this.settingsService.addCurrentApplication(application);

    this.router.navigate([
      '/admin',
      'applications',
      application._id.applicationName,
      application._id.applicationVersion,
      'sessions',
    ]);
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
