import { Injectable, inject, signal } from '@angular/core';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, isSideBar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);
  private readonly userConnectedGuard = inject(UserConnectedGuard);

  readonly edit = signal(false);

  sidebarItems: SidebarItem[] = [
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

  // Used to display the sidebar on the navigation component.
  currentSidebar: SidebarItem[];

  set sideBar(entry: SidebarItem[]) {
    if (!this.userConnectedGuard.canActivate()) {
      this.currentSidebar = entry.filter(element => element.id !== 'profile');
    } else {
      this.currentSidebar = entry;
    }
  }

  constructor() {
    this.sideBar = this.formatSidebar(this.restoreSidebar());
  }

  restoreSidebar(): Sidebar[] {
    const sidebar = this.storageService.getItem('navigation-sidebar', true) as Sidebar[] || this.defaultConfigService.defaultSidebar;

    return sidebar.filter(element => isSideBar(element));
  }

  resetSidebar(defaultConfig: boolean = false) {
    if (defaultConfig) {
      this.sideBar = this.formatSidebar(this.defaultConfigService.defaultSidebar);
      this.storageService.setItem('navigation-sidebar', this.defaultConfigService.defaultSidebar);
    } else {
      this.sideBar = this.formatSidebar(this.restoreSidebar());
    }
  }

  saveSidebar() {
    const sidebar = this.currentSidebar.map((item) => item.id);
    this.sideBar = this.formatSidebar(sidebar);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  updateSidebar(sidebar: Sidebar[]) {
    this.sideBar = this.formatSidebar(sidebar);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  addSidebarItem(sidebar: Sidebar) {
    const item = this.sidebarItems.find(sidebarItem => sidebar === sidebarItem.id);
    if (item) {
      this.currentSidebar.push(item);
    }
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
    return sidebarItems.reduce((acc, item) => {
      const sidebarItem = this.sidebarItems.find(sidebarItem => sidebarItem.id === item);
      if (sidebarItem) {
        acc.push(sidebarItem);
      }

      return acc;
    }, [] as SidebarItem[]);

  }

  restoreExternalServices(): ExternalService[] {
    return this.storageService.getItem('navigation-external-services', true) as ExternalService[] || [];
  }

  saveExternalServices(externalServices: ExternalService[]) {
    this.storageService.setItem('navigation-external-services', externalServices);
  }
}
