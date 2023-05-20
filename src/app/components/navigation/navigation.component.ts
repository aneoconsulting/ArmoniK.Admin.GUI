import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '@services/user.service';
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
      <div class="title">
        <span>ArmoniK</span>
        <span> - </span>
        <span class="greeting">{{ greeting() }}</span>
      </div>
      <div class="spacer"></div>
      <button mat-button class="version" [matMenuTriggerFor]="menu">
        <mat-icon matListItemIcon aria-hidden="true" fontIcon="arrow_drop_down"></mat-icon>
        <span>
          v{{ version }}
        </span>
      </button>
      <mat-menu #menu="matMenu">
        <a mat-menu-item [href]="'https://github.com/esoubiran-aneo/armonik-admin-gui/releases/v' + version" target="_blank" rel="noopener noreferrer">
          <mat-icon matListItemIcon aria-hidden="true" fontIcon="update"></mat-icon>
          <span>Changelog</span>
        </a>
        <a mat-menu-item href="https://esoubiran-aneo.github.io/armonik-admin-gui" target="_blank" rel="noopener">
          <mat-icon matListItemIcon aria-hidden="true" fontIcon="help_outline"></mat-icon>
          <span>Documentation</span>
        </a>
      </mat-menu>
    </mat-toolbar>
    <mat-sidenav-container autosize class="sidenav-container">
      <mat-sidenav #drawer class="sidenav"
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-nav-list>
          <a mat-list-item routerLink="/profile" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="account_circle"></mat-icon>
            <span matListItemTitle> Profile </span>
          </a>
        </mat-nav-list>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/applications" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="apps"></mat-icon>
            <span matListItemTitle> Applications </span>
          </a>
          <a mat-list-item routerLink="/partitions" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="donut_small"></mat-icon>
            <span matListItemTitle> Partitions </span>
          </a>
        </mat-nav-list>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/sessions" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="workspaces"></mat-icon>
            <span matListItemTitle> Sessions </span>
          </a>
          <a mat-list-item routerLink="/results" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="workspace_premium"></mat-icon>
            <span matListItemTitle> Results </span>
          </a>
        </mat-nav-list>
        <mat-divider></mat-divider>
        <mat-nav-list>
          <a mat-list-item routerLink="/settings" routerLinkActive="navbar-item-selected">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="settings"></mat-icon>
            <span matListItemTitle> Settings </span>
          </a>
        </mat-nav-list>
        <mat-divider></mat-divider>
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

main {
  padding: 20px 50px;
}
  `],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatMenuModule,
  ]
})
export class NavigationComponent {
  version = pkg.version;

  private breakpointObserver = inject(BreakpointObserver);
  private userService = inject(UserService);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  greeting() {
    const hour = new Date().getHours();
    const username = this.userService.user ? this.userService.user.username : '';
    if (hour < 12) {
      return 'Good morning' + (username ? ', ' + username : '');
    } else if (hour < 18) {
      return 'Good afternoon' + (username ? ', ' + username : '');
    } else {
      return 'Good evening' + (username ? ', ' + username : '');
    }
  }
}
