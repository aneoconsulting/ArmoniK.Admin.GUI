import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { SettingsService } from '../../../core';

@Component({
  selector: 'app-pages-applications-subnav',
  templateUrl: './applications-subnav.component.html',
  styleUrls: ['./applications-subnav.component.scss'],
})
export class ApplicationsSubnavComponent {
  constructor(
    private _settingsService: SettingsService,
    private _router: Router
  ) {}

  public get currentApplications(): Set<Application['_id']> {
    return this._settingsService.currentApplications;
  }

  /**
   * Remove current application from the list
   *
   * @param application
   */
  removeApplication(application: Application['_id']): void {
    this._settingsService.removeCurrentApplication(application);
    this._router.navigate(['/', 'dashboard']);
  }

  /**
   * Used to tack current application Id for ngFor
   *
   * @param index
   * @param item
   *
   * @returns value
   */
  trackByApplicationId(_: number, item: Application['_id']): string {
    return `${item.applicationName}${item.applicationVersion}`;
  }
}
