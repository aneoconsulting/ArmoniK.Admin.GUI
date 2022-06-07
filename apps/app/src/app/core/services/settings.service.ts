import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  currentApplications: Set<Application['_id']>;

  constructor() {
    this.currentApplications = new Set(this.getCurrentApplicationFromStore());
  }

  /**
   * Add application to the current applications
   *
   * @param application Application to add
   */
  addCurrentApplication(application: Application): void {
    if (!this.currentApplications.has(application._id)) {
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
    if (this.currentApplications.has(applicationId)) {
      this.currentApplications.delete(applicationId);
      this.storeCurrentApplications();
    }
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
      JSON.stringify(Array.from(this.currentApplications))
    );
  }
}
