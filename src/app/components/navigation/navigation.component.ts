import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CdkScrollableModule } from '@angular/cdk/scrolling';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

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
      <span>ArmoniK</span>
    </mat-toolbar>
    <mat-sidenav-container autosize class="sidenav-container">
      <mat-sidenav #drawer class="sidenav"
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-nav-list>
          <a mat-list-item routerLink="/applications">
            <mat-icon matListItemIcon aria-hidden="true" fontIcon="apps"></mat-icon>
            <div matListItemTitle> Applications </div>
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
    MatIconModule
  ]
})
export class NavigationComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
