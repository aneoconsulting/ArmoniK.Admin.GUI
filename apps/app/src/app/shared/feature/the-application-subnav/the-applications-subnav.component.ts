import { NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClrIconModule } from '@clr/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from '../../util';

@Component({
  standalone: true,
  selector: 'app-pages-the-applications-subnav',
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

  public get currentApplications(): Set<string> {
    return this._settingsService.currentApplications;
  }

  /**
   * Remove current application from the list
   *
   * @param application
   */
  removeApplication(application: string): void {
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
  trackByApplicationId(_: number, item: string): string {
    return item;
  }
}
