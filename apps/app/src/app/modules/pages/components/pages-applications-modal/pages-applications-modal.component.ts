import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { ApplicationsService } from '../../../core/services/http';

@Component({
  selector: 'app-pages-applications-modal',
  templateUrl: './pages-applications-modal.component.html',
  styleUrls: ['./pages-applications-modal.component.scss'],
})
export class PagesApplicationsModalComponent {
  @Input() opened = false;
  @Output() openedChange = new EventEmitter<boolean>();
  @Output() receivedApplication = new EventEmitter<Application>();

  selectedApplication: Application['id'] | null = null;
  applications: Application[] = [];

  constructor(private applicationsService: ApplicationsService) {
    this.applicationsService.index().subscribe((applications) => {
      this.applications = applications;
    });
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
}
