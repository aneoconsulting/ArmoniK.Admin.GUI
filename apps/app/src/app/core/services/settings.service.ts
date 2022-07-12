import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Application } from '@armonik.admin.gui/armonik-typing';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  seqEndpoint: string | null = null;
  currentApplications: Set<Application['_id']>;

  constructor() {
    this.currentApplications = new Set(this.getCurrentApplicationsFromStore());
  }

  /**
   * Verify if Seq is up and running
   *
   * @returns True if Seq is up and running, false otherwise
   */
  isSeqUp(): boolean {
    return this.seqEndpoint !== null;
  }

  /**
   * Generate Seq url
   *
   * @param query Query to add to the url
   *
   * @returns Seq url
   */
  generateSeqUrl(query: { [key: string]: string }): string {
    if (!this.seqEndpoint) return '';

    // If seqEndpoint doesn't contains a slash at the end, add it
    if (this.seqEndpoint.slice(-1) !== '/') {
      this.seqEndpoint += '/';
    }

    // If seqEndpoint doesn't contains http:// or https://, add it
    try {
      const url = new URL(this.seqEndpoint);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        this.seqEndpoint = 'http://' + url.host;
      }
    } catch (e) {
      this.seqEndpoint = `http://${this.seqEndpoint}`;
    }

    // Create HTTP Params
    const params = new HttpParams({
      fromObject: query,
    });

    return `${this.seqEndpoint}?${params.toString()}`;
  }

  /**
   * Generate Seq Url for task error
   *
   * @param taskId Task id
   *
   */
  generateSeqUrlForTaskError(taskId: string): string {
    return this.generateSeqUrl({
      filter: `taskId = '${taskId}' && @Level = 'Error'`,
    });
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
