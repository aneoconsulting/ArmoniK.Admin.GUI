import { Injectable, inject } from '@angular/core';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, isSideBar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import { UserService } from './user.service';

@Injectable()
export class NavigationService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);
  private readonly userConnectedGuard = inject(UserConnectedGuard);
  private readonly userService = inject(UserService);

  sidebarItems: SidebarItem[] = [
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
  currentSidebar: SidebarItem[];

  set sideBar(entry: SidebarItem[]) {
    this.currentSidebar = entry;
  }

  constructor() {
    this.refreshSidebar();
  }

  refreshSidebar() {
    this.sideBar = this.formatSidebar(this.restoreSidebar());
  }

  canAccessRoute(route: string): boolean {
    const routeId = route.replace(/^\//, '');
    return this.hasPermissionForItem(routeId);
  }

  restoreSidebar(): Sidebar[] {
    const sidebar = this.storageService.getItem('navigation-sidebar', true) as Sidebar[] || this.defaultConfigService.defaultSidebar;

    return sidebar.filter(element => isSideBar(element));
  }

  saveSidebar(sidebar: Sidebar[]) {
    this.sideBar = this.formatSidebar(sidebar);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  updateSidebar(sidebar: Sidebar[]) {
    this.sideBar = this.formatSidebar(sidebar);
  }


  saveSideBarOpened(sideBarOpened: boolean) {
    this.storageService.setItem('navigation-sidebar-opened', sideBarOpened);
  }

  restoreSideBarOpened(): boolean {
    return this.storageService.getItem('navigation-sidebar-opened') !== 'false';
  }

  private hasPermissionForItem(itemId: string): boolean {
    const permissions = this.userService.user?.permissions ?? [];
    const permissionMap: { [key: string]: string[] } = {
      'applications': ['Applications:ListApplications'],
      'partitions': ['Partitions:GetPartition', 'Partitions:ListPartitions'],
      'results': ['Results:ListResults'],
      'sessions': ['Sessions:ListSessions', 'Sessions:GetSession'],
      'tasks': ['Tasks:GetTask', 'Tasks:ListTasks', 'Tasks:ListTasksDetailed', 'Tasks:GetResultIds'],
    };

    const requiredPermissions = permissionMap[itemId];
    if (!requiredPermissions) {
      return true;
    }

    return requiredPermissions.some(permission => permissions.includes(permission));
  }

  /**
   * Change the format of a simple sidebar to a [SidebarItem](../types/navigation.ts)
   */
  formatSidebar(sidebarItems: Sidebar[]): SidebarItem[] {
    const sidebar = sidebarItems.reduce((acc, item) => {
      const sidebarItem = this.sidebarItems.find(sidebarItem => sidebarItem.id === item);
      if (sidebarItem && this.hasPermissionForItem(sidebarItem.id)) {
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
