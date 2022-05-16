import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { AppSettingsService } from '../../../core/services';
import { ApplicationsService } from '../../../core/services/http';

@Component({
  selector: 'app-pages-applications-modal',
  templateUrl: './pages-applications-modal.component.html',
  styleUrls: ['./pages-applications-modal.component.scss'],
})
export class PagesApplicationsModalComponent implements OnInit, OnChanges {
  @Input() opened = false;
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() receivedApplication = new EventEmitter<Application>();

  selectedApplication: Application['id'] | null = null;
  applications: Application[] = [];

  constructor(
    private applicationsService: ApplicationsService,
    private appSettingsService: AppSettingsService
  ) {}

  ngOnInit(): void {
    this.applicationsService.index().subscribe((applications) => {
      this.applications = this.filterApplications(
        applications,
        this.appSettingsService.currentApplications
      );
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['opened']) {
      this.applications = this.filterApplications(
        this.applications,
        this.appSettingsService.currentApplications
      );
    }
  }

  validate(): void {
    if (this.selectedApplication) {
      const application = this.applications.find(
        (application) => application.id === this.selectedApplication
      );
      this.receivedApplication.emit(application);
    }
    this.close();
  }

  close(): void {
    this.selectedApplication = null;
    this.openedChange.emit(false);
  }

  filterApplications(
    applications: Application[],
    currentApplications: Application[]
  ): Application[] {
    return applications.filter(
      (application) =>
        !currentApplications.some((app) => app.id === application.id)
    );
  }
}
