import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  currentApplications: Application['_id'][] = [];

  constructor() {
    this.currentApplications = this.getCurrentApplicationFromStore();
  }

  /**
   * Add application to the current applications
   *
   * @param application Application to add
   */
  addCurrentApplication(application: Application): void {
    if (!this.findCurrentApplication(application._id)) {
      this.currentApplications.push(application._id);
      this.storeCurrentApplications();
    }
  }

  /**
   * Remove application from the current applications
   *
   * @param application Application to remove
   */
  removeCurrentApplication(applicationId: Application['_id']): void {
    if (this.findCurrentApplication(applicationId)) {
      this.currentApplications = this.currentApplications.filter(
        (currentApplication) => {
          return !(
            currentApplication.applicationName ===
              applicationId.applicationName &&
            currentApplication.applicationVersion ===
              applicationId.applicationVersion
          );
        }
      );
      this.storeCurrentApplications();
    }
  }

  private findCurrentApplication(applicationId: Application['_id']): boolean {
    return (
      this.currentApplications.findIndex((currentApplication) => {
        return (
          currentApplication.applicationName ===
            applicationId.applicationName &&
          currentApplication.applicationVersion ===
            applicationId.applicationVersion
        );
      }) !== -1
    );
  }

  /**
   * Get current applications from local storage
   */
  private getCurrentApplicationFromStore(): Application['_id'][] {
    const data = localStorage.getItem('currentApplications');

    if (data) return JSON.parse(data);
    else return [];
  }

  /**
   * Store current applications in local storage
   */
  private storeCurrentApplications(): void {
    localStorage.setItem(
      'currentApplications',
      JSON.stringify(this.currentApplications)
    );
  }
}
