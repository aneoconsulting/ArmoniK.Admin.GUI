import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { ApplicationsService } from '../../../core/services/http';

@Component({
  selector: 'app-pages-applications',
  templateUrl: './pages-applications.component.html',
  styleUrls: ['./pages-applications.component.scss'],
})
export class PagesApplicationsComponent {
  @Input() currentApplications: Application[] = [];
  @Output() receivedApplication = new EventEmitter<Application['id']>();

  applications: Application[] = [];
  selectedApplication: Application['id'] | null = null;
  opened = true;

  constructor(private applicationsService: ApplicationsService) {
    this.applicationsService.index().subscribe((applications) => {
      this.applications = applications;
    });
  }

  addApplication(): void {
    this.opened = true;
    this.selectedApplication = null;
  }

  validate(): void {
    if (this.selectedApplication) {
      this.receivedApplication.emit(this.selectedApplication);
    }
    this.opened = false;
  }

  trackByApplication(index: number, application: Application): string {
    return application.id;
  }
}
