import { Injectable, inject } from '@angular/core';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, SidebarItems, isSideBar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);

  sidebarItems: SidebarItems = [
    {
      type: 'link',
      id: 'profile',
      display: $localize`Profile`,
      route: '/profile',
    },
    {
      type: 'link',
      id: 'dashboard',
      display: $localize`Dashboard`,
      route: '/dashboard',
    },
    {
      type: 'link',
      id: 'applications',
      display: $localize`Applications`,
      route: '/applications',
    },
    {
      type: 'link',
      id: 'partitions',
      display: $localize`Partitions`,
      route: '/partitions',
    },
    {
      type: 'link',
      id: 'sessions',
      display: $localize`Sessions`,
      route: '/sessions',
    },
    {
      type: 'link',
      id: 'tasks',
      display: $localize`Tasks`,
      route: '/tasks',
    },
    {
      type: 'link',
      id: 'results',
      display: $localize`Results`,
      route: '/results',
    },
    {
      type: 'divider',
      id: 'divider',
      display: $localize`Divider`,
      route: null,
    },
  ];

  defaultSidebar: Sidebar[] = this.defaultConfigService.defaultSidebar;

  // Used to display the sidebar on the navigation component.
  currentSidebar: SidebarItem[] = this.formatSidebar(this.restoreSidebar());

  restoreSidebar(): Sidebar[] {
    const sidebar = this.storageService.getItem('navigation-sidebar', true) as Sidebar[] || this.defaultConfigService.defaultSidebar;

    return sidebar.filter(element => isSideBar(element));
  }

  saveSidebar(sidebar: Sidebar[]) {
    this.currentSidebar = this.formatSidebar(sidebar);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  updateSidebar(sidebar: Sidebar[]) {
    this.currentSidebar = this.formatSidebar(sidebar);
  }


  saveSideBarOpened(sideBarOpened: boolean) {
    this.storageService.setItem('navigation-sidebar-opened', sideBarOpened);
  }

  restoreSideBarOpened(): boolean {
    return this.storageService.getItem('navigation-sidebar-opened') !== 'false';
  }

  /**
   * Change the format of a simple sidebar to a [SidebarItem](../types/navigation.ts)
   */
  formatSidebar(sidebarItems: Sidebar[]): SidebarItem[] {
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
    return this.storageService.getItem('navigation-external-services', true) as ExternalService[] || [];
  }

  saveExternalServices(externalServices: ExternalService[]) {
    this.storageService.setItem('navigation-external-services', externalServices);
  }
}
