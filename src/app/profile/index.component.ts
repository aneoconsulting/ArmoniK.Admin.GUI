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
  templateUrl: './index.component.html', 
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
