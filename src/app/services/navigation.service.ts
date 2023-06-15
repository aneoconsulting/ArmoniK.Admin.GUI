import { Injectable, inject } from '@angular/core';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, SidebarItems } from '@app/types/navigation';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  #storageService = inject(StorageService);

  #key = 'navigation';
  #externalServicesKey = 'external-services';
  #sidebarKey = 'sidebar';

  sidebarItems: SidebarItems = [
    {
      type: 'link',
      id: 'profile',
      display: $localize`Profile`,
      // TODO: Use icons from IconsService
      icon: 'account_circle',
      route: '/profile',
    },
    {
      type: 'link',
      id: 'dashboard',
      display: $localize`Dashboard`,
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      type: 'link',
      id: 'applications',
      display: $localize`Applications`,
      icon: 'apps',
      route: '/applications',
    },
    {
      type: 'link',
      id: 'partitions',
      display: $localize`Partitions`,
      icon: 'donut_small',
      route: '/partitions',
    },
    {
      type: 'link',
      id: 'sessions',
      display: $localize`Sessions`,
      icon: 'workspaces',
      route: '/sessions',
    },
    {
      type: 'link',
      id: 'results',
      display: $localize`Results`,
      icon: 'workspace_premium',
      route: '/results',
    },
    {
      type: 'link',
      id: 'settings',
      display: $localize`Settings`,
      icon: 'settings',
      route: '/settings',
    },
    {
      type: 'divider',
      id: 'divider',
      display: $localize`Divider`,
      icon: null,
      route: null,
    },
  ];

  defaultSidebar: Sidebar[] = [
    'profile',
    'divider',
    'dashboard',
    'divider',
    'applications',
    'partitions',
    'divider',
    'sessions',
    'results',
    'divider',
    'settings',
    'divider'
  ];

  // Used to display the sidebar on the navigation component.
  currentSidebar: SidebarItem[] = this.#formatSidebar(this.restoreSidebar());

  restoreSidebar(): Sidebar[] {
    const sidebar = this.#storageService.getItem(this.#storageService.buildKey(this.#key, this.#sidebarKey), true) as Sidebar[] || this.defaultSidebar;

    return sidebar;
  }

  saveSidebar(sidebar: Sidebar[]) {
    this.currentSidebar = this.#formatSidebar(sidebar);
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, this.#sidebarKey), sidebar);
  }

  updateSidebar(sidebar: Sidebar[]) {
    this.currentSidebar = this.#formatSidebar(sidebar);
  }

  #formatSidebar(sidebarItems: Sidebar[]): SidebarItem[] {
    const sidebar = sidebarItems.reduce((acc, item) => {
      const sidebarItem = this.sidebarItems.find(sidebarItem => sidebarItem.id === item);

      if (sidebarItem) {
        acc.push(sidebarItem);
      }

      return acc;
    }, [] as SidebarItem[]);

    return sidebar;
  }

  restoreExternalServices(): ExternalService[] {
    return this.#storageService.getItem(this.#storageService.buildKey(this.#key, this.#externalServicesKey), true) as ExternalService[] || [];
  }

  saveExternalServices(externalServices: ExternalService[]) {
    this.#storageService.setItem(this.#storageService.buildKey(this.#key, this.#externalServicesKey), externalServices);
  }

  get sidebarKey() {
    return this.#storageService.buildKey(this.#key, this.#sidebarKey);
  }
}
