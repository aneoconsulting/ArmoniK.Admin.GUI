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
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ExternalService } from '@app/types/external-service';
import { DefaultConfigService } from '@services/default-config.service';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { ManageExternalServicesDialogComponent } from './manage-external-services-dialog.component';
import { ThemeSelectorComponent } from './theme-selector.component';
import pkg from '../../../../package.json';

@Component({
  selector: 'app-navigation',
  template: `
    <mat-toolbar color="primary">
      <button
        type="button"
        aria-label="Toggle sidenav"
        mat-icon-button
        (click)="drawer.toggle()"
        *ngIf="isHandset$ | async">
        <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
      </button>
      <!-- TODO: Add the logo -->
      <div class="title">
        <span>ArmoniK</span>
        <span> - </span>
        <span class="greeting">{{ greeting() }}</span>
      </div>
      <div class="spacer"></div>
      <div class="environment" [style]="'color:' + environment.color + ';'" [matTooltip]="environment.description">
        {{ environment.name }} {{ environment.version }}
      </div>
      <div class="spacer"></div>
      <button mat-button [matMenuTriggerFor]="switchLanguage" [matTooltip]="languageButtonTip">
        <mat-icon matListItemIcon [fontIcon]="getIcon('language')" aria-hidden="true">Truc</mat-icon>
        <span>{{selectedLanguage.toLocaleUpperCase()}}</span>
      </button>
      <mat-menu #switchLanguage="matMenu">
        <ng-container *ngFor="let language of availableLanguages; trackBy:trackByLanguage">
          <a mat-menu-item [href]="'/admin/' + language + getRoute()" (click)="setLanguage(language)">{{language.toLocaleUpperCase()}}</a>
        </ng-container>
      </mat-menu>
      <button mat-button class="external-services" [matMenuTriggerFor]="external_services" matTooltip="Access to external services">
        <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('arrow-down')"></mat-icon>
        <span i18n="Button to view external services">
          External Services
        </span>
      </button>
      <mat-menu #external_services="matMenu">
        <ng-container *ngFor="let service of externalServices; trackBy:trackByService">
          <a mat-menu-item [href]="service.url" target="_blank" rel="noopener noreferrer">
            <mat-icon *ngIf="service.icon" matListItemIcon aria-hidden="true" [fontIcon]="service.icon"></mat-icon>
            <span>{{ service.name }}</span>
          </a>
        </ng-container>
        <mat-divider *ngIf="externalServices.length"></mat-divider>
        <button mat-menu-item (click)="manageExternalServices()">
          <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('tune')"></mat-icon>
          <span i18n="Button">Manage service</span>
        </button>
      </mat-menu>
      <button mat-button class="version" [matMenuTriggerFor]="versionMenu" matTooltip="More Infos" i18n-matTooltip>
        <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('arrow-down')"></mat-icon>
        <span>
          v{{ version }}
        </span>
      </button>
      <mat-menu #versionMenu="matMenu">
        <a mat-menu-item [href]="'https://github.com/aneoconsulting/ArmoniK.Admin.GUI/releases/v' + version" target="_blank" rel="noopener noreferrer">
          <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('update')"></mat-icon>
          <span i18n="Button">Changelog</span>
        </a>
        <a mat-menu-item href="https://aneoconsulting.github.io/ArmoniK.Admin.GUI" target="_blank" rel="noopener">
          <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('help')"></mat-icon>
          <span i18n="Button">Documentation</span>
        </a>
        <!-- Api does not prefix tag with a v -->
        <a mat-menu-item target="_blank" [href]="'https://github.com/aneoconsulting/ArmoniK.Api/releases/' + apiVersion">
          <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getIcon('api')"></mat-icon>
          <span>
            <span i18n="Button">API</span> - v{{ apiVersion }}
          </span>
        </a>
        <!-- Core does not prefix tag with a v -->
        <a mat-menu-item target="_blank" [href]="'https://github.com/aneoconsulting/ArmoniK.Core/releases/' + coreVersion">
            <mat-icon matSuffix aria-hidden="true" [fontIcon]="getIcon('hub')"></mat-icon>
          <span>
            <span i18n="Button">Core</span> - v{{ coreVersion }}
          </span>
        </a>
      </mat-menu>
      <app-theme-selector></app-theme-selector>
    </mat-toolbar>
    <mat-sidenav-container autosize class="sidenav-container">
      <mat-sidenav #drawer class="sidenav"
      [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
      [mode]="(isHandset$ | async) ? 'over' : 'side'"
      [opened]="(isHandset$ | async) === false">
        <mat-nav-list>
          <ng-container *ngFor="let item of getSidebar()">
            <ng-container *ngIf="item.type === 'divider'">
              <mat-divider></mat-divider>
            </ng-container>
            <ng-container *ngIf="item.type !== 'divider'">
              <a mat-list-item [routerLink]="item.route" routerLinkActive="navbar-item-selected">
                <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="item.icon"></mat-icon>
                <span matListItemTitle> {{ item.display}} </span>
              </a>
            </ng-container>
          </ng-container> 
          <a mat-list-item [routerLink]="'/settings'" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="settings"></mat-icon>
            <span matListItemTitle> {{ settingsItem }} </span>
          </a>  
        </mat-nav-list>
        
      </mat-sidenav>
      <mat-sidenav-content>
        <main>
          <ng-content></ng-content>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>

  `,
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
  ]
})
export class NavigationComponent implements OnInit{
  version = pkg.version;
  externalServices: ExternalService[];

  #breakpointObserver = inject(BreakpointObserver);
  #dialog = inject(MatDialog);
  #navigationService = inject(NavigationService);
  #userService = inject(UserService);
  #iconsService = inject(IconsService);
  #versionsService = inject(VersionsService);
  #environmentService = inject(EnvironmentService);
  #router = inject(Router);
  #storageService = inject(StorageService);
  #defaultConfigService = inject(DefaultConfigService);

  availableLanguages: string[];
  selectedLanguage: string;

  environment = this.#environmentService.getEnvironment();

  apiVersion = this.#versionsService.api;
  coreVersion = this.#versionsService.core;
  settingsItem = $localize`Settings`;

  languageButtonTip = $localize`Change language`;
  
  isHandset$: Observable<boolean> = this.#breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    this.externalServices = this.#navigationService.restoreExternalServices();
    
    this.selectedLanguage = this.#storageService.getItem('language') ?? this.#defaultConfigService.defaultLanguage;
    this.availableLanguages = this.#defaultConfigService.availableLanguages.filter(language => language != this.selectedLanguage);
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

  setLanguage(language: string) {
    this.#storageService.setItem('language', language);
  }

  getRoute() {
    return this.#router.url;
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

  trackByLanguage(_: number, language: string) {
    return language;
  }
}
