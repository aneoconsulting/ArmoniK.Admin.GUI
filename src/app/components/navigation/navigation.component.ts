import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HealthCheckComponent } from '@app/healthcheck/healthcheck.component';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { ResponsiveService } from '@services/responsive.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { Subscription, interval } from 'rxjs';
import { ChangeLanguageButtonComponent } from './change-language-button.component';
import { ExternalServicesComponent } from './external-services/external-services.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import pkg from '../../../../package.json';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: 'navigation.component.css',
  standalone: true,
  providers: [
    StorageService,
    IconsService,
  ],
  imports: [
    RouterModule,
    ThemeSelectorComponent,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    ChangeLanguageButtonComponent,
    HealthCheckComponent,
    ExternalServicesComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements AfterViewInit, OnDestroy {
  version = this.getVersion();

  private readonly responsiveService = inject(ResponsiveService);
  private readonly navigationService = inject(NavigationService);
  private readonly userService = inject(UserService);
  private readonly iconsService = inject(IconsService);
  private readonly versionsService = inject(VersionsService);
  private readonly environmentService = inject(EnvironmentService);

  @ViewChild(MatSidenav) readonly sidenav: MatSidenav;

  environment = this.environmentService.getEnvironment();

  apiVersion = this.versionsService.api;
  coreVersion = this.versionsService.core;
  settingsItem = $localize`Settings`;

  get isNotDesktop() {
    return this.responsiveService.isNotDesktop;
  }

  private readonly subscriptions = new Subscription();

  private readonly _greetings = signal<string>('');

  get greetings() {
    return this._greetings();
  }

  sidebar = this.navigationService.currentSidebar;

  ngAfterViewInit(): void {
    this.sidenav.opened = this.navigationService.restoreSideBarOpened();
    this.verifyGreetings();
    this.subscriptions.add(interval(60000).subscribe(() => this.verifyGreetings()));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getVersion(): string {
    return process.env['NODE_ENV'] === 'development' ? '-dev' : pkg.version;
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  private verifyGreetings() {
    const hour = new Date().getHours();
    const username = this.userService.user ? this.userService.user.username : '';
    if (hour <= 12) {
      this._greetings.set($localize`Good morning` + (username !== '' ? ', ' + username : ''));
    } else if (hour < 18) {
      this._greetings.set($localize`Good afternoon` + (username !== '' ? ', ' + username : ''));
    } else {
      this._greetings.set($localize`Good evening` + (username !== '' ? ', ' + username : ''));
    }
  }

  toggleSideBar() {
    this.sidenav.opened = !this.sidenav.opened;
    this.navigationService.saveSideBarOpened(this.sidenav.opened);
  }
}
