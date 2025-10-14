import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal, computed } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { HealthCheckComponent } from '@app/healthcheck/healthcheck.component';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ChangeLanguageButtonComponent } from './change-language-button.component';
import { ExternalServicesComponent } from './external-services/external-services.component';
import { SchemeSwitcherComponent } from './scheme-switcher/scheme-switcher.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import { VersionsMenuComponent } from './version-menu/versions-menu.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: 'navigation.component.scss',
  providers: [
    StorageService,
    IconsService,
  ],
  imports: [
    AsyncPipe,
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
    VersionsMenuComponent,
    SchemeSwitcherComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent implements OnInit {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly navigationService = inject(NavigationService);
  private readonly iconsService = inject(IconsService);
  private readonly environmentService = inject(EnvironmentService);
  private readonly userConnectedGuard = inject(UserConnectedGuard);

  environment = this.environmentService.getEnvironment();
  settingsItem = $localize`Settings`;

  private userConnected = signal(this.userConnectedGuard.canActivate());
  isProfileButtonDisabled = computed(() => !this.userConnected());

  sidebar = this.navigationService.currentSidebar;
  sideBarOpened = true;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.sideBarOpened = this.navigationService.restoreSideBarOpened();
    this.updateUserConnectionStatus();
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  public updateUserConnectionStatus(): void {
    this.userConnected.set(this.userConnectedGuard.canActivate());
  }

  toggleSideBar() {
    this.sideBarOpened = !this.sideBarOpened;
    this.navigationService.saveSideBarOpened(this.sideBarOpened);
  }
}
