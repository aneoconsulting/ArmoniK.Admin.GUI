import { Injectable, inject, signal } from '@angular/core';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem, isSideBar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';

@Injectable()
export class NavigationService {
  private readonly defaultConfigService = inject(DefaultConfigService);
  private readonly storageService = inject(StorageService);

  readonly edit = signal(false);

  readonly sideBarOpened = signal(true);
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

  // Used to display the sidebar on the navigation component.
  currentSidebar: SidebarItem[];

  set sidebar(entry: SidebarItem[]) {
    this.currentSidebar = entry;
  }

  constructor() {
    this.resetSidebarToStored();
    this.sideBarOpened.set(this.storageService.getItem('navigation-sidebar-opened') !== 'false');
  }

  /**
   * Returns the stored sidebar configuration.
   * If a stored item is not a sidebar item, it will be filtered.
   */
  restoreSidebar(): Sidebar[] {
    const sidebar = this.storageService.getItem('navigation-sidebar', true) as Sidebar[] || this.defaultConfigService.defaultSidebar;

    return sidebar.filter(element => isSideBar(element));
  }

  /**
   * Set the current sidebar as the stored sidebar.
   */
  resetSidebarToStored() {
    this.sidebar = this.formatSidebar(this.restoreSidebar());
  }

  /**
   * Reset the sidebar to its default configuration.
   */
  resetSidebarToDefault() {
    this.sidebar = this.formatSidebar(this.defaultConfigService.defaultSidebar);
    this.storageService.setItem('navigation-sidebar', this.defaultConfigService.defaultSidebar);
  }

  /**
   * Store the current sidebar configuration.
   */
  saveSidebar() {
    const sidebar = this.currentSidebar.map((item) => item.id);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  /**
   * Updates the current sidebar with the provided one and stores it.
   * @param sidebar Sidebar[]
   */
  updateSidebar(sidebar: Sidebar[]) {
    this.sidebar = this.formatSidebar(sidebar);
    this.storageService.setItem('navigation-sidebar', sidebar);
  }

  /**
   * Add a sidebar item to the sidebar. 
   * @param sidebar Sidebar
   */
  addSidebarItem(sidebar: Sidebar) {
    const item = this.sidebarItems.find(sidebarItem => sidebar === sidebarItem.id);
    if (item) {
      this.currentSidebar.push(item);
    }
  }

  /**
   * Delete the sidebar item at the specified index.
   * @param index number
   */
  deleteSidebarItem(index: number) {
    this.currentSidebar = this.currentSidebar.filter((_item, itemIndex) => index !== itemIndex);
  }

  /**
   * Updates sidebarOpened and stores it.
   */
  toggleSidebarOpened() {
    this.sideBarOpened.set(!this.sideBarOpened());
    this.storageService.setItem('navigation-sidebar-opened', this.sideBarOpened());
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

  restoreSideBarOpened(): boolean {
    return this.storageService.getItem('navigation-sidebar-opened', true) as boolean ?? this.defaultConfigService.defaultSidebarOpened;
  }

  /**
   * Restores all external services configuration from the store
   * @returns ExternalService[]
   */
  restoreExternalServices(): ExternalService[] {
    return this.storageService.getItem('navigation-external-services', true) as ExternalService[] || [];
  }

  /**
   * Saves current external services configuration in the store
   * @param externalServices ExternalService[]
   */
  saveExternalServices(externalServices: ExternalService[]) {
    this.storageService.setItem('navigation-external-services', externalServices);
  }
}
