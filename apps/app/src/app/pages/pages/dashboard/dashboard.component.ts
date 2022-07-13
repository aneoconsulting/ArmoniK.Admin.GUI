import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Application,
  ApplicationError,
  Pagination,
} from '@armonik.admin.gui/armonik-typing';
import { ClrDatagridStateInterface } from '@clr/angular';
import {
  AppError,
  ApplicationsService,
  BrowserTitleService,
  LanguageService,
  PagerService,
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

  errors: AppError[] = [];

  applicationsErrorsLoading = true;
  applicationsErrors: Pagination<ApplicationError> | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private languageService: LanguageService,
    private browserTitleService: BrowserTitleService,
    private settingsService: SettingsService,
    private pagerService: PagerService,
    private applicationsService: ApplicationsService
  ) {}

  ngOnInit() {
    this.browserTitleService.setTitle(
      this.languageService.instant('pages.dashboard.title')
    );

    this.route.data.subscribe((data) => {
      if (data['applications']) {
        this.applications = data['applications'];
      }
    });
  }

  get isSeqUp(): boolean {
    return this.settingsService.isSeqUp();
  }

  /**
   * Redirect to Seq
   *
   * @param taskId Task ID
   *
   * @returns URL
   */
  redirectToSeq(taskId: string) {
    window.open(
      this.settingsService.generateSeqUrlForTaskError(taskId),
      '_blank'
    );
  }

  /**
   * Used to get the list of application errors from the api
   * using pagination for the datagrid and refresh the datagrid
   *
   * @param state Clarity datagrid state
   */
  onRefreshApplicationsErrors(state: ClrDatagridStateInterface) {
    this.applicationsErrorsLoading = true;

    const params = this.pagerService.createHttpParams(state);

    this.applicationsService.getAllWithErrorsPaginated(params).subscribe({
      error: this.onErrorApplicationsErrors.bind(this),
      next: this.onNextApplicationsErrors.bind(this),
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

  /**
   * Handle the error when getting applications
   *
   * @param error Error
   */
  private onErrorApplicationsErrors(error: AppError) {
    this.applicationsErrorsLoading = false;
    this.errors.push(error);
  }

  /**
   * Handle applications when getting them
   *
   * @param applications Applications
   */
  private onNextApplicationsErrors(applications: Pagination<ApplicationError>) {
    this.applicationsErrorsLoading = false;
    this.applicationsErrors = applications;
  }
}
