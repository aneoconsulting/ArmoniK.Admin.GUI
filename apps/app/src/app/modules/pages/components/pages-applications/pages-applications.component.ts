import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Component({
  selector: 'app-pages-applications',
  templateUrl: './pages-applications.component.html',
  styleUrls: ['./pages-applications.component.scss'],
})
export class PagesApplicationsComponent {
  @Input() currentApplications: Application[] = [];
  @Output() addApplicationChange = new EventEmitter<Application>();
  @Output() removeApplicationChange = new EventEmitter<Application>();

  opened = false;

  addApplication(): void {
    this.opened = true;
  }

  removeApplication(application: Application): void {
    this.currentApplications = this.currentApplications.filter(
      (app) => app.id !== application.id
    );
    this.removeApplicationChange.emit(application);
  }

  onReceivedApplication(application: Application): void {
    this.addApplicationChange.emit(application);
  }

  trackByApplication(_: number, application: Application): string {
    return application.id;
  }
}
