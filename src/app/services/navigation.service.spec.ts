import { TestBed } from '@angular/core/testing';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { ExternalService } from '@app/types/external-service';
import { Sidebar, SidebarItem } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { NavigationService } from './navigation.service';
import { StorageService } from './storage.service';

describe('NavigationService', () => {
  let service: NavigationService;
  
  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };

  const mockDefaultConfigService = {
    defaultSidebar: ['applications', 'divider', 'partitions'],
    defaultSidebarOpened: true,
  };

  const mockUserConnectedGuard = {
    canActivate: jest.fn(() => true),
  };

  const sidebar: Sidebar[] = ['applications', 'divider', 'sessions', 'sessions'];
  const expectedFormatResult = [
    {
      type: 'link',
      id: 'applications',
      display: 'Applications',
      route: '/applications'
    },
    {
      type: 'divider',
      id: 'divider',
      display: 'Divider',
      route: null
    },
    {
      type: 'link',
      id: 'sessions',
      display: 'Sessions',
      route: '/sessions'
    },
    {
      type: 'link',
      id: 'sessions',
      display: 'Sessions',
      route: '/sessions'
    }
  ];
  const externalServices: ExternalService[] = [{
    name: 'external service',
    url: './my-url',
    icon: 'external'
  }];
  
  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        NavigationService,
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: UserConnectedGuard, useValue: mockUserConnectedGuard }
      ]
    }).inject(NavigationService);
  });

  it('Should run', () => {
    expect(service).toBeTruthy();
  });

  it('should set edit to false', () => {
    expect(service.edit()).toBeFalsy();
  });

  describe('initialisation', () => {
    it('should restore sidebar configuration', () => {
      expect(mockStorageService.getItem).toHaveBeenNthCalledWith(1, 'navigation-sidebar', true);
    });

    it('should restore SideBarOpened', () => {
      expect(mockStorageService.getItem).toHaveBeenNthCalledWith(2, 'navigation-sidebar-opened');
    });
  });

  describe('restoreSidebar', () => {
    let storedSideBar: Sidebar[] | null;
    mockStorageService.getItem.mockImplementation(() => {
      return storedSideBar;
    });

    it('Should restore the stored sidebar', () => {
      storedSideBar = ['applications', 'dashboard', 'divider', 'sessions'];
      expect(service.restoreSidebar()).toEqual(storedSideBar);
    });

    it('Should restore default config sidebar if none is stored', () => {
      storedSideBar = null;
      expect(service.restoreSidebar()).toEqual(mockDefaultConfigService.defaultSidebar);
    });
  });

  describe('setting sidebar', () => {
    const newSideBar = [{id: 'applications'}, {id: 'partitions'}, {id: 'divider'}] as SidebarItem[];
    it('should set the whole sidebar', () => {
      service.sidebar = newSideBar;
      expect(service.currentSidebar).toEqual(newSideBar);
    });
  });

  describe('saveSidebar', () => {
    it('should store the current sidebar configuration', () => {
      service.saveSidebar();
      expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar', service.currentSidebar.map(sb => sb.id));
    });
  });

  describe('updateSidebar', () => {
    beforeEach(() => {
      service.updateSidebar(sidebar);
    });

    it('should change and format the current sidebar', () => {
      expect(service.currentSidebar).toEqual(expectedFormatResult);
    });

    it('should store the updated sidebar', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar', sidebar);
    });
  });

  describe('resetSidebarToDefault', () => {
    beforeEach(() => {
      service.resetSidebarToDefault();
    });

    it('should replace the current sidebar with the default one', () => {
      expect(service.currentSidebar).toEqual([
        {
          type: 'link',
          id: 'applications',
          display: 'Applications',
          route: '/applications'
        },
        {
          type: 'divider',
          id: 'divider',
          display: 'Divider',
          route: null
        },
        {
          type: 'link',
          id: 'partitions',
          display: 'Partitions',
          route: '/partitions'
        },
      ]);
    });

    it('should store the default sidebar', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar', mockDefaultConfigService.defaultSidebar);
    });
  });

  describe('resetSidebarToStored', () => {
    beforeEach(() => {
      service.currentSidebar = [
        {
          type: 'link',
          id: 'applications',
          display: 'Applications',
          route: '/applications'
        },
      ];
      mockStorageService.getItem.mockReturnValueOnce(sidebar);
      service.resetSidebarToStored();
    });

    it('should set the current sidebar as the stored sidebar', () => {
      expect(service.currentSidebar).toEqual(expectedFormatResult);
    });
  });

  it('should add an item to the sidebar', () => {
    service.updateSidebar(sidebar);
    service.addSidebarItem('dashboard');
    expect(service.currentSidebar).toEqual([
      ...expectedFormatResult,
      {
        type: 'link',
        id: 'dashboard',
        display: 'Dashboard',
        route: '/dashboard'
      },
    ]);
  });

  it('should delete the sidebar item at the specified index', () => {
    service.deleteSidebarItem(0);
    expect(service.currentSidebar.map(s => s.id).includes('applications')).toBeFalsy();
  });

  describe('toggleSidebarOpened', () => {
    let previousSidebarOpened: boolean;

    beforeEach(() => {
      previousSidebarOpened = service.sideBarOpened();
      service.toggleSidebarOpened();
    });

    it('should toggle sidebarOpened', () => {
      expect(service.sideBarOpened()).not.toEqual(previousSidebarOpened);
    });

    it('should store the toggled sidebar', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar-opened', service.sideBarOpened());
    });
  });

  describe('restoreSidebarOpened', () => {
    it('should restore the stored sidebarOpened', () => {
      const sidebarOpened = false;
      mockStorageService.getItem.mockReturnValueOnce(sidebarOpened);
      expect(service.restoreSideBarOpened()).toBe(sidebarOpened);
    });

    it('should restore the defaultSidebarOpened if nothing is stored', () => {
      mockStorageService.getItem.mockReturnValueOnce(null);
      expect(service.restoreSideBarOpened()).toBe(mockDefaultConfigService.defaultSidebarOpened);
    });
  });

  describe('restoreExternalService', () => {
    it('should return stored item', () => {
      mockStorageService.getItem.mockReturnValueOnce(externalServices);
      expect(service.restoreExternalServices()).toBe(externalServices);
    });

    it('should return empty list if there is no stored item', () => {
      mockStorageService.getItem.mockReturnValueOnce(null);
      expect(service.restoreExternalServices()).toEqual([]);
    });
  });

  test('saveExternalServices should call setItem', () => {
    service.saveExternalServices(externalServices);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-external-services', externalServices);
  });
});