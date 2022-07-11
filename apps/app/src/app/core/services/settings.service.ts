import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  isSeqUp = false;
  currentApplications: Set<Application['_id']>;

  constructor() {
    this.currentApplications = new Set(this.getCurrentApplicationsFromStore());
  }

  /**
   * Add application to the current applications
   *
   * @param application Application to add
   */
  addCurrentApplication(application: Application): void {
    if (!this.hasCurrentApplication(application._id)) {
      this.currentApplications.add(application._id);
      this.storeCurrentApplications();
    }
  }

  /**
   * Remove application from the current applications
   *
   * @param application Application to remove
   */
  removeCurrentApplication(applicationId: Application['_id']): void {
    if (this.hasCurrentApplication(applicationId)) {
      this.currentApplications.delete(applicationId);
      this.storeCurrentApplications();
    }
  }

  /**
   * Check if current applications contains application
   * Can't use default 'has' from Set because of object reference
   *
   * @param applicationId Application id to check
   *
   * @returns True if current applications contains application, false otherwise
   */
  private hasCurrentApplication(applicationId: Application['_id']): boolean {
    for (const id of this.currentApplications) {
      if (
        id.applicationName === applicationId.applicationName &&
        id.applicationVersion === applicationId.applicationVersion
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get current applications from local storage
   */
  private getCurrentApplicationsFromStore(): Application['_id'][] {
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
      JSON.stringify(Array.from(this.currentApplications))
    );
  }
}
