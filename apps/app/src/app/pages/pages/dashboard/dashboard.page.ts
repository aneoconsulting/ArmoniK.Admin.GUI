import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { Subscription } from 'rxjs';
import {
  AppError,
  BrowserTitleService,
  LanguageService,
  SettingsService,
} from '../../../core';

/**
 *  Display the dashboard
 */
@Component({
  selector: 'app-pages-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  applicationsErrorsSubscription = new Subscription();
  subscriptions: Subscription = new Subscription();

  applications: Application[] = [];

  errors: AppError[] = [];

  applicationsErrorsStateKey = 'applications-errors';
  applicationsErrorsLoading = true;
  applicationsErrors: Pagination<ApplicationError> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    public settingsService: SettingsService
  ) {}

  ngOnInit() {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.dashboard.title')
    );

    this.subscriptions.add(
      this.route.data.subscribe((data) => {
        if (data['applications']) {
          this.applications = data['applications'];
        }
      })
    );
  }

  ngOnDestroy() {
    this.applicationsErrorsSubscription.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  /**
   * Update application on application click
   *
   * @param applicationId
   */
  onApplicationClick(application: Application) {
    this.settingsService.addCurrentApplication(application);

    this.router.navigate([
      '/',
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
