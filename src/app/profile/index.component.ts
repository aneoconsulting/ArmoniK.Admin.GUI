import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-profile-index',
  template: `
<app-page-header>
  <mat-icon matListItemIcon aria-hidden="true" fontIcon="account_circle"></mat-icon>
  <span>
    <span> Profile from </span>
    <span> {{ user.username }} </span>
  </span>
</app-page-header>

<p>
  This is your profile page. You can see your user data below.
</p>

<app-page-section>
  <app-page-section-header icon="group">
    Roles
  </app-page-section-header>

  <ng-container *ngIf="user.roles && user.roles.length; else noRoles">
    <ul>
      <li *ngFor="let role of user.roles">
        {{ role }}
      </li>
    </ul>
  </ng-container>

  <!-- TODO: Add a button to read more about permissions -->
</app-page-section>

<app-page-section>
  <app-page-section-header icon="lock">
    Permissions
  </app-page-section-header>

  <ng-container *ngIf="user.permissions && user.permissions.length; else noPermissions">
    <!-- TODO: Create a better organization with related icon in application -->
    <ul>
      <li *ngFor="let permission of user.permissions">
        {{ permission }}
      </li>
    </ul>
  </ng-container>

  <!-- TODO: Add a button to read more about permissions -->
</app-page-section>

<ng-template #noRoles>
  <p>
    You do not have any roles.
  </p>
</ng-template>

<ng-template #noPermissions>
  <p>
    You do not have any permissions.
  </p>
</ng-template>
  `,
  styles: [`
  `],
  standalone: true,
  providers: [],
  imports: [
    NgFor,
    NgIf,
    PageHeaderComponent,
    PageSectionComponent,
    PageSectionHeaderComponent,
    MatIconModule,
  ]
})
export class IndexComponent {
  constructor(
    private _userService: UserService
  ) { }

  get user() {
    return this._userService.user;
  }
}
