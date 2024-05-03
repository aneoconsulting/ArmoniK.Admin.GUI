import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ExternalService } from '@app/types/external-service';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { ChangeLanguageButtonComponent } from './change-language-button.component';
import { ManageExternalServicesDialogComponent } from './manage-external-services-dialog.component';
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
    NgIf,
    NgFor,
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
  ]
})
export class NavigationComponent implements OnInit {
  version = process.env['NODE_ENV'] === 'development' ? '-dev' : pkg.version;
  externalServices: ExternalService[];

  #breakpointObserver = inject(BreakpointObserver);
  #dialog = inject(MatDialog);
  #navigationService = inject(NavigationService);
  #userService = inject(UserService);
  #iconsService = inject(IconsService);
  #versionsService = inject(VersionsService);
  #environmentService = inject(EnvironmentService);

  environment = this.#environmentService.getEnvironment();

  apiVersion = this.#versionsService.api;
  coreVersion = this.#versionsService.core;
  settingsItem = $localize`Settings`;

  sideBarOpened = true;
  
  isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.externalServices = this.#navigationService.restoreExternalServices();
    this.sideBarOpened = this.#navigationService.restoreSideBarOpened();
  }

  manageExternalServices() {
    const dialogRef = this.#dialog.open(ManageExternalServicesDialogComponent, {
      data: {
        externalServices: this.externalServices,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.externalServices = result;
        this.#navigationService.saveExternalServices(this.externalServices);
      }
    });
  }

  getIcon(name: string): string {
    return this.#iconsService.getIcon(name);
  }

  getSidebar() {
    return this.#navigationService.currentSidebar;
  }

  greeting() {
    const hour = new Date().getHours();
    const username = this.#userService.user ? this.#userService.user.username : '';
    // TODO: localize with params
    if (hour < 12) {
      return $localize`Good morning` + (username !== '' ? ', ' + username : '');
    } else if (hour < 18) {
      return $localize`Good afternoon` + (username !== '' ? ', ' + username : '');
    } else {
      return $localize`Good evening` + (username !== '' ? ', ' + username : '');
    }
  }

  trackByService(_: number, service: ExternalService) {
    return service.name + service.url;
  }

  toggleSideBar() {
    this.sideBarOpened = !this.sideBarOpened;
    this.#navigationService.saveSideBarOpened(this.sideBarOpened);
  }
}
