import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ChangeLanguageButtonComponent } from './change-language-button.component';
import { ExternalServicesComponent } from './external-services/external-services.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import pkg from '../../../../package.json';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styles: [`
.sidenav-container {
  height: calc(100% - 64px);
}

.sidenav {
  width: 200px;
}

.sidenav .mat-toolbar {
  background: inherit;
}

.mat-toolbar.mat-primary {
  position: sticky;
  top: 0;
  z-index: 2;
}

.navbar-item-selected {
  background-color: rgba(0, 0, 0, 0.2);
}

.spacer {
  flex: 1 1 auto;
}

.greeting {
  font-weight: normal;
}

.environment {
  background: white;
  padding: 0 1rem;
  border-radius: 0.25rem;
}

main {
  padding: 20px 50px;
}
  `],
  standalone: true,
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
  ]
})
export class NavigationComponent implements OnInit{
  version = this.getVersion();

  #breakpointObserver = inject(BreakpointObserver);
  #navigationService = inject(NavigationService);
  #userService = inject(UserService);
  #iconsService = inject(IconsService);
  #versionsService = inject(VersionsService);
  #environmentService = inject(EnvironmentService);

  environment = this.#environmentService.getEnvironment();

  apiVersion = this.#versionsService.api;
  coreVersion = this.#versionsService.core;
  settingsItem = $localize`Settings`;

  sidebar = this.#navigationService.currentSidebar;
  sideBarOpened = true;
  
  isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.sideBarOpened = this.#navigationService.restoreSideBarOpened();
  }

  getVersion(): string {
    return process.env['NODE_ENV'] === 'development' ? '-dev' : pkg.version;
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  greeting() {
    const hour = new Date().getHours();
    const username = this.#userService.user ? this.#userService.user.username : '';
    if (hour < 12) {
      return $localize`Good morning` + (username !== '' ? ', ' + username : '');
    } else if (hour < 18) {
      return $localize`Good afternoon` + (username !== '' ? ', ' + username : '');
    } else {
      return $localize`Good evening` + (username !== '' ? ', ' + username : '');
    }
  }

  toggleSideBar() {
    this.sideBarOpened = !this.sideBarOpened;
    this.#navigationService.saveSideBarOpened(this.sideBarOpened);
  }
}
