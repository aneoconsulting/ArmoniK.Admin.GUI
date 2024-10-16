import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Key } from '@app/types/config';
import { Sidebar, SidebarItem } from '@app/types/navigation';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { NotificationService } from '@services/notification.service';
import { StorageService } from '@services/storage.service';
import { of } from 'rxjs';
import { IndexComponent } from './index.component';

class FakeFileReader extends FileReader {
  _result: string;

  override set result(entry: string) {
    this._result = entry;
  }

  override get result() {
    return this._result;
  }
  
  constructor(result: string) {
    super();
    this.result = result;
  }

  override onload = jest.fn();

  override readAsText() {
    this.onload();
  }
}

describe('IndexComponent', () => {
  let component: IndexComponent;

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockSideBar: Sidebar[] = ['profile', 'dashboard', 'sessions', 'tasks'];

  const mockSidebarItems: SidebarItem[] = [
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

  const mockNavigationService = {
    restoreSidebar: jest.fn(() => [...mockSideBar]),
    saveSidebar: jest.fn(),
    updateSidebar: jest.fn(),
    defaultSidebar: [...mockSideBar],
    sidebarItems: [...mockSidebarItems]
  };

  const mockKeys: Key[] = ['applications-columns', 'dashboard-lines', 'language'];

  const mockStorageService = {
    restoreKeys: jest.fn(() => new Set([...mockKeys])),
    removeItem: jest.fn(),
    importData: jest.fn(),
    exportData: jest.fn(),
  };

  let dialogResult: boolean;

  const mockDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(dialogResult))
      };
    })
  };

  const mockHttpClient = {
    get: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        IconsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: StorageService, useValue: mockStorageService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: HttpClient, useValue: mockHttpClient },
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set keys', () => {
      expect(component.keys).toEqual(new Set(mockKeys));
    });

    it('should set sidebar', () => {
      expect(component.sidebar).toEqual(mockSideBar);
    });
  });

  it('should retrieve icons', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  it('should reset sidebar', () => {
    component.onRestoreSidebar();
    expect(mockNavigationService.restoreSidebar).toHaveBeenCalled();
  });

  it('should clear side bar', () => {
    component.sidebar = ['applications', 'divider', 'partitions'];
    dialogResult = true;
    component.onClearSideBar();
    expect(component.sidebar).toEqual(mockSideBar);
  });

  describe('onSaveSideBar', () => {
    it('should save sidebar', () => {
      component.onSaveSidebar();
      expect(mockNavigationService.saveSidebar).toHaveBeenCalledWith(component.sidebar);
    });
  
    it('should restore keys', () => {
      component.keys = new Set();
      component.onSaveSidebar();
      expect(component.keys).toEqual(new Set(mockKeys));
    });
  });

  it('should remove an item of the sidebar according to its index', () => {
    component.onRemoveSidebarItem(0);
    expect(component.sidebar).toEqual(['dashboard', 'sessions', 'tasks']);
  });

  it('should add a sidebar item at the end of the set', () => {
    component.onAddSidebarItem();
    expect(component.sidebar).toEqual([...mockSideBar, 'dashboard']);
  });

  it('should return the sidebar items', () => {
    expect(component.getSidebarItems()).toEqual(mockSidebarItems.map(item => {
      return {
        name: item.display,
        value: item.id
      };
    }));
  });

  describe('findSidebarItem', () => {
    it('should find a sidebar item', () => {
      expect(component.findSidebarItem('applications')).toEqual({
        type: 'link',
        id: 'applications',
        display: $localize`Applications`,
        route: '/applications',
      });
    });
  
    it('should throw an Error if it does not find any item', () => {
      expect(() => component.findSidebarItem('notExisting' as Sidebar)).toThrow();
    });
  });

  it('should update the sidebar item on change', () => {
    component.onSidebarItemChange(0, 'results');
    expect(component.sidebar[0]).toEqual('results');
  });

  describe('updateKeySelection', () => {
    const keys: Key[] = ['dashboard-lines', 'applications-columns'];

    beforeEach(() => {
      component.selectedKeys = new Set(keys);
    });
  
    it('should delete the key from the selection', () => {
      const event = {
        source: {
          name: 'dashboard-lines' as Key
        }
      } as MatCheckboxChange;
      component.updateKeySelection(event);
      expect(component.selectedKeys).toEqual(new Set(['applications-columns']));
    });
  
    it('should add the key to the selection', () => {
      const event = {
        source: {
          name: 'language' as Key
        }
      } as MatCheckboxChange;
      component.updateKeySelection(event);
      expect(component.selectedKeys).toEqual(new Set([...keys, 'language']));
    });
  });

  describe('onSubmitStorage', () => {
    const keys: Key[] = ['dashboard-lines', 'applications-columns'];

    beforeEach(() => {
      component.selectedKeys = new Set(keys);
      const event = {
        preventDefault: jest.fn()
      } as unknown as SubmitEvent;
      component.onSubmitStorage(event);
    });

    it('should delete all selected keys', () => {
      expect(component.keys).toEqual(new Set(['language']));
    });

    it('should remove all selected keys from the storage', () => {
      expect(mockStorageService.removeItem).toHaveBeenCalledTimes(keys.length);
    });

    it('should clear selectedKeys', () => {
      expect(component.selectedKeys).toEqual(new Set([]));
    });

    it('should notify on success', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('clear All', () => {
    const serverReturn = JSON.stringify({language: 'en'});
    mockHttpClient.get.mockReturnValue(of(serverReturn));
    dialogResult = true;

    beforeEach(() => {
      component.clearAll();
    });

    it('should delete all keys', () => {
      expect(component.keys).toEqual(new Set());
    });

    it('should remove all items from storageService', () => {
      expect(mockStorageService.removeItem).toHaveBeenCalledTimes(mockKeys.length);
    });

    it('should retrieve server config', () => {
      expect(mockStorageService.importData).toHaveBeenCalledWith(serverReturn as string, false, false);
    });

    it('should notify on success', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('exportData', () => {
    const anchor = {
      href: '',
      download: '',
      click: jest.fn()
    };

    global.document.createElement = jest.fn().mockReturnValue(anchor);

    global.URL.createObjectURL = jest.fn();
    
    beforeEach(() => {
      component.exportData();
    });

    it('should notify on success', () => {
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('onSubmitImport', () => {
    const newSideBar: Sidebar[] = ['results', 'partitions'];
    const data = {'navigation-sidebar': newSideBar};

    const file = new File([JSON.stringify(data)], 'settings', {type: 'application/json'});
    const target = {
      querySelector: jest.fn().mockReturnValue({files: [file]}),
      reset: jest.fn()
    };

    const event = {
      target: target,
      preventDefault: jest.fn()
    } as unknown as SubmitEvent;

    jest.spyOn(global, 'FileReader').mockReturnValue(new FakeFileReader(JSON.stringify(data)));

    beforeEach(() => {
      mockStorageService.restoreKeys.mockReturnValueOnce(new Set(Object.keys(data) as Key[]));
      mockNavigationService.restoreSidebar.mockReturnValueOnce(data['navigation-sidebar']);
    });

    it('should not accept undefined forms', () => {
      expect(component.onSubmitImport({target: undefined, preventDefault: jest.fn()} as unknown as SubmitEvent)).toBeUndefined();
    });

    it('should not accept invalid input', () => {
      target.querySelector.mockReturnValueOnce(undefined);
      expect(component.onSubmitImport(event)).toBeUndefined();
    });

    it('should not accept empty files input', () => {
      target.querySelector.mockReturnValueOnce({files: []});
      expect(component.onSubmitImport(event)).toBeUndefined();
    });

    it('should notify on empty file', () => {
      target.querySelector.mockReturnValueOnce({files: []});
      component.onSubmitImport(event);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should not accept not json file', () => {
      target.querySelector.mockReturnValueOnce({files: [{type: 'application/txt'}]});
      component.onSubmitImport(event);
      expect(component.onSubmitImport(event)).toBeUndefined();
    });

    it('should notify on wrong file type', () => {
      target.querySelector.mockReturnValueOnce({files: [{type: 'application/txt'}]});
      component.onSubmitImport(event);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should reset the form on wrong file type', () => {
      target.querySelector.mockReturnValueOnce({files: [{type: 'application/txt'}]});
      component.onSubmitImport(event);
      expect(target.reset).toHaveBeenCalled();
    });

    it('should import data in storage', async () => {
      component.onSubmitImport(event);
      expect(mockStorageService.importData).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it('should set keys', () => {
      component.onSubmitImport(event);
      expect(component.keys).toEqual(new Set(Object.keys(data) as Key[]));
    });

    it('should set sidebar', () => {
      component.onSubmitImport(event);
      expect(mockNavigationService.updateSidebar).toHaveBeenCalledWith(data['navigation-sidebar']);
    });

    it('should notify on success', () => {
      component.onSubmitImport(event);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should console warn in case of reading error', () => {
      console.warn = jest.fn().mockImplementation(() => {});
      mockStorageService.importData.mockImplementationOnce(() => {throw new Error();});
      component.onSubmitImport(event);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      console.warn = jest.fn().mockImplementation(() => {});
      mockStorageService.importData.mockImplementationOnce(() => {throw new Error();});
      component.onSubmitImport(event);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should reset the form', () => {
      component.onSubmitImport(event);
      expect(target.reset).toHaveBeenCalled();
    });
  });

  it('should update position on drop', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as CdkDragDrop<SidebarItem[]>;
    component.drop(event);
    expect(component.sidebar).toEqual(['dashboard', 'profile', 'sessions', 'tasks']);
  });

  it('should retrieve the config file name', () => {
    const fileName = 'settings';
    const event = {
      target: {
        files: {
          item: jest.fn().mockReturnValue({name: fileName})
        }
      }
    } as unknown as Event;
    component.addConfigFile(event);
    expect(component.fileName).toEqual(fileName);
  });
});