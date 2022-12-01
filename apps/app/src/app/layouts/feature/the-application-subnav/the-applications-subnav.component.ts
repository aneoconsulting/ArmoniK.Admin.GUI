import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Application } from '@armonik.admin.gui/armonik-typing';
import { ClrIconModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../../../core';

@Component({
  standalone: true,
  selector: 'app-layouts-the-applications-subnav',
  templateUrl: './the-applications-subnav.component.html',
  styleUrls: ['./the-applications-subnav.component.scss'],
  imports: [RouterModule, ClrIconModule, TranslateModule, NgIf, NgFor],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TheApplicationsSubnavComponent {
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
