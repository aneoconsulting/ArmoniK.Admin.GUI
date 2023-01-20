import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap } from '@angular/router';
import { BehaviorSubject, Observable, map, distinctUntilChanged } from 'rxjs';

@Injectable()
export class SettingsService {
  private _intervals = [10_000, 30_000, 60_000, 120_000];

  grafanaSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  seqSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  currentApplications: Set<string>;

  constructor() {
    this.currentApplications = new Set(this.getCurrentApplicationsFromStore());
  }

  public get intervals() {
    return this._intervals;
  }

  public get initialInterval() {
    return this._intervals[0];
  }

  /**
   * Generate Seq url
   *
   * @param query Query to add to the url
   *
   * @returns Seq url
   */
  generateSeqUrl(query: { [key: string]: string }): string {
    const seqPath = '/seq/#/events';

    // Create HTTP Params
    const params = new HttpParams({
      fromObject: query,
    });

    return `${seqPath}?${params.toString()}`;
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
  addCurrentApplication(application: string): void {
    // if (!this.hasCurrentApplication(application._id)) {
    //   this.currentApplications.add(application._id);
    //   this.storeCurrentApplications();
    // }
  }

  /**
   * Remove application from the current applications
   *
   * @param application Application to remove
   */
  removeCurrentApplication(applicationId: string): void {
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
  private hasCurrentApplication(applicationId: string): boolean {
    // for (const id of this.currentApplications) {
    //   if (
    //     id.applicationName === applicationId.applicationName &&
    //     id.applicationVersion === applicationId.applicationVersion
    //   ) {
    //     return true;
    //   }
    // }
    return false;
  }

  /**
   * Get current applications from local storage
   */
  private getCurrentApplicationsFromStore(): string[] {
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

  /**
   * Get query params from route and return them as Date
   *
   * @param param
   *
   * @returns Observable<Date | null>
   */
  public queryDateParam(
    queryParams: ActivatedRouteSnapshot['queryParams'],
    param: string
  ): Date | null {
    return queryParams[param] ? new Date(parseInt(queryParams[param])) : null;
  }

  /**
   * Get query params from route and return them as a list
   *
   * @param param
   *
   * @returns Observable<string>
   */
  public queryListParam(
    queryParams: ActivatedRouteSnapshot['queryParams'],
    param: string
  ): number[] {
    const params: string[] = queryParams[param];
    if (params) {
      return params.map((elem) => parseInt(elem));
    }
    return [];
  }

  /**
   * Get query params from route
   *
   * @param param
   *
   * @returns Observable
   */
  public queryParam<T>(
    queryParams: ActivatedRouteSnapshot['queryParams'],
    param: string
  ): T | null {
    return queryParams[param] ? (queryParams[param] as T) : null;
  }
}
