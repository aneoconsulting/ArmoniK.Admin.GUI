import { TestBed } from '@angular/core/testing';
import { ExternalService } from '@app/types/external-service';
import { Sidebar } from '@app/types/navigation';
import { DefaultConfigService } from './default-config.service';
import { NavigationService } from './navigation.service';
import { StorageService } from './storage.service';

describe('NavigationService', () => {
  let service: NavigationService;
  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };
  const sidebar: Sidebar[] = ['applications', 'divider', 'sessions', 'sessions'];
  const expectedFormatResult = [
    {
      type: 'link',
      id: 'applications',
      display: 'Applications',
      icon: 'apps',
      route: '/applications'
    },
    {
      type: 'divider',
      id: 'divider',
      display: 'Divider',
      icon: null,
      route: null
    },
    {
      type: 'link',
      id: 'sessions',
      display: 'Sessions',
      icon: 'workspaces',
      route: '/sessions'
    },
    {
      type: 'link',
      id: 'sessions',
      display: 'Sessions',
      icon: 'workspaces',
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
        { provide: StorageService, useValue: mockStorageService }
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
      expect(service.restoreSidebar()).toBe(storedSideBar);
    });

    it('Should restore default config sideBar if none is stored', () => {
      storedSideBar = null;
      expect(service.restoreSidebar()).toEqual(new DefaultConfigService().defaultSidebar);
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

  test('restoreExternalServices should return the call of StorageService.getItem', () => {
    mockStorageService.getItem.mockImplementationOnce(() => {
      return externalServices; 
    });

    expect(service.restoreExternalServices()).toBe(externalServices);
  });

  test('saveExternalServices should call setItem', () => {
    service.saveExternalServices(externalServices);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('navigation-external-services', externalServices);
  });
});