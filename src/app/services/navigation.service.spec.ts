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
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: UserConnectedGuard, useValue: mockUserConnectedGuard }
      ]
    }).inject(NavigationService);
  });

  it('Should run', () => {
    expect(service).toBeTruthy();
  });

  describe('restoreSidebar', () => {
    let storedSideBar: Sidebar[] | null;
    mockStorageService.getItem.mockImplementation(() => {
      return storedSideBar;
    });

    it('Should restore the stored sideBar', () => {
      storedSideBar = ['applications', 'dashboard', 'divider', 'sessions'];
      expect(service.restoreSidebar()).toEqual(storedSideBar);
    });

    it('Should restore default config sideBar if none is stored', () => {
      storedSideBar = null;
      expect(service.restoreSidebar()).toEqual(new DefaultConfigService().defaultSidebar);
    });
  });

  describe('setting sidebar', () => {
    const newSideBar = [{id: 'applications'}, {id: 'partitions'}, {id: 'divider'}] as SidebarItem[];
    it('should set the whole sidebar', () => {
      service.sideBar = newSideBar;
      expect(service.currentSidebar).toEqual(newSideBar);
    });
  });

  describe('saveSidebar', () => {
    
    it('should change the format of the provided sidebar and set it to the current SideBar', () => {
      service.saveSidebar(sidebar);
      expect(service.currentSidebar).toEqual(expectedFormatResult);
    });

    it('should call StorageService.setItem', () => {
      service.saveSidebar(sidebar);
      expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar', sidebar);
    });
  });

  test('updateSidebar should change and format the current sidebar', () => {
    service.updateSidebar(sidebar);
    expect(service.currentSidebar).toEqual(expectedFormatResult);
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

  it('should save SideBarOpened', () => {
    const sideBarOpened = true;
    service.saveSideBarOpened(sideBarOpened);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-sidebar-opened', sideBarOpened);
  });

  it('should restore SideBarOpened', () => {
    const sideBarOpened = true;
    mockStorageService.getItem.mockReturnValueOnce(sideBarOpened);
    expect(service.restoreSideBarOpened()).toBe(sideBarOpened);
  });
});