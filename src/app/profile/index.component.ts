import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Page } from '@app/types/pages';
import { PageHeaderComponent } from '@components/page-header.component';
import { PageSectionHeaderComponent } from '@components/page-section-header.component';
import { PageSectionComponent } from '@components/page-section.component';
import { IconsService } from '@services/icons.service';
import { QueryParamsService } from '@services/query-params.service';
import { ShareUrlService } from '@services/share-url.service';
import { UserService } from '@services/user.service';
import { PermissionGroup } from './types';

@Component({
  selector: 'app-profile-index',
  template: `
<app-page-header [sharableURL]="sharableURL">
  <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon('profile')"></mat-icon>
  <span>
    <span i18n="Page title"> Profile from </span>
    <span> {{ user.username }} </span>
  </span>
</app-page-header>

<p i18n="Description of the page">
  This is your profile page. You can see your user data below.
</p>

<app-page-section>
  <app-page-section-header icon="group">
    Roles
  </app-page-section-header>

  <ng-container *ngIf="user.roles && user.roles.length; else noRoles">
    <ul>
      <!-- TODO: Add in issue the needed of adding custom roles to the user -->
      <li *ngFor="let role of user.roles">
        {{ role }}
      </li>
    </ul>
  </ng-container>

  <!-- TODO: Add a button to read more about permissions -->
</app-page-section>

<app-page-section>
  <app-page-section-header icon="lock">
    <span i18n="Section title"> Permissions </span>
  </app-page-section-header>

  <ng-container *ngIf="user.permissions && user.permissions.length; else noPermissions">
    <div class="permissions">
      <ng-container *ngFor="let group of groupedPermissions()">
        <div class="permission">
          <h3>
            <mat-icon matListItemIcon aria-hidden="true" [fontIcon]="getPageIcon(group.name)"></mat-icon>
            {{ group.name }}
          </h3>
          <ul>
            <!-- TODO: Create a page in documentation (ArmoniK) in order to explain what's does that mean -->
            <li *ngFor="let permission of group.permissions">
              {{ permission }}
            </li>
          </ul>
        </div>
      </ng-container>
    </div>
  </ng-container>

  <!-- TODO: Add a button to read more about permissions -->
</app-page-section>

<ng-template #noRoles>
  <p>
    <em i18n>
      You do not have any roles.
    </em>
  </p>
</ng-template>

<ng-template #noPermissions>
  <p>
    <em i18n>
      You do not have any permissions.
    </em>
  </p>
</ng-template>
  `,
  styles: [`
.permissions {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.2rem;
}

.permission h3 {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;

  text-transform: capitalize;

  margin-bottom: 0.5rem;
}

.permission h3 mat-icon {
  height: 1.25rem;
  width: 1.25rem;
  font-size: 1.25rem;
}

.permission ul {
  margin: 0;
}
  `],
  standalone: true,
  providers: [
    ShareUrlService,
    QueryParamsService,
  ],
  imports: [
    NgFor,
    NgIf,
    PageHeaderComponent,
    PageSectionComponent,
    PageSectionHeaderComponent,
    MatIconModule,
  ]
})
export class IndexComponent implements OnInit {
  sharableURL = '';

  #userService = inject(UserService);
  #shareUrlService = inject(ShareUrlService);
  #iconsService = inject(IconsService);

  ngOnInit(): void {
    this.sharableURL = this.#shareUrlService.generateSharableURL(null, null);
  }

  get user() {
    return this.#userService.user;
  }

  getIcon(name: string) {
    return this.#iconsService.getIcon(name);
  }

  getPageIcon(name: Page) {
    return this.#iconsService.getPageIcon(name);
  }

  groupedPermissions(): PermissionGroup[] {
    const permissions = this.#userService.user.permissions;

    const groups: PermissionGroup[] = [];

    for (const permission of permissions) {
      const [group, name] = permission.split(':');

      const groupIndex = groups.findIndex(g => g.name === group.toLocaleLowerCase());

      if (groupIndex === -1) {
        groups.push({
          name: group.toLowerCase() as Page,
          permissions: [name],
        });
      } else {
        groups[groupIndex].permissions.push(name);
      }
    }

    // Sort groups by name
    groups.sort((a, b) => a.name.localeCompare(b.name));

    return groups;
  }
}
