import { Component, OnInit } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { TranslateService } from '@ngx-translate/core';
import { AppError, ApplicationsService, TitleService } from '../../../core';

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
  loadingApplications = true;

  constructor(
    private titleService: TitleService,
    private translateService: TranslateService,
    private applicationsService: ApplicationsService
  ) {
    this.titleService.setTitle(
      this.translateService.instant('dashboard.title')
    );
  }

  /**
   * Load all application on init or display an error
   */
  ngOnInit() {
    this.applicationsService.getAll().subscribe({
      error: (error: AppError) => {
        this.errors.push(error);
        this.loadingApplications = false;
      },
      next: (applications: Application[]) => {
        this.applications = applications;
        this.loadingApplications = false;
      },
    });
  }

  /**
   * Return translated error message using the status code
   */
  getTranslatedError(error: AppError): string {
    return this.translateService.instant(`dashboard.errors.${error.status}`, {
      value: error.id,
      name: error.operation,
    });
  }

  /**
   * Used to track application for ngFor
   */
  trackByApplication(_: number, application: Application) {
    return application._id;
  }

  /**
   * Used to track error for ngFor
   */
  trackByError(index: number) {
    return index;
  }
}
