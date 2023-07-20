import { Injectable, inject } from '@angular/core';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, SidebarItems } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  #defaultConfigService = inject(DefaultConfigService);
  #storageService = inject(StorageService);

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
      id: 'tasks',
      display: $localize`Tasks`,
      icon: 'adjust',
      route: '/tasks',
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

  defaultSidebar: Sidebar[] = this.#defaultConfigService.defaultSidebar;

  // Used to display the sidebar on the navigation component.
  currentSidebar: SidebarItem[] = this.#formatSidebar(this.restoreSidebar());

  restoreSidebar(): Sidebar[] {
    const sidebar = this.#storageService.getItem('navigation-sidebar', true) as Sidebar[] || this.#defaultConfigService.defaultSidebar;

    return sidebar;
  }

  saveSidebar(sidebar: Sidebar[]) {
    this.currentSidebar = this.#formatSidebar(sidebar);
    this.#storageService.setItem('navigation-sidebar', sidebar);
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
    return this.#storageService.getItem('navigation-external-services', true) as ExternalService[] || [];
  }

  saveExternalServices(externalServices: ExternalService[]) {
    this.#storageService.setItem('navigation-external-services', externalServices);
  }
}
