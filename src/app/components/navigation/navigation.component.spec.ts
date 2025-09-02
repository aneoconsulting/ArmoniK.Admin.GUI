import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { SidebarItem } from '@app/types/navigation';
import { DefaultConfigService } from '@services/default-config.service';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { Subject, lastValueFrom, of } from 'rxjs';
import { AddSideBarItemDialogResult } from './add-sidebar-item-dialog/types';
import { NavigationComponent } from './navigation.component';


// Creating a way to control the interval without having to fake the time.
const fakeIntervalSubject = new Subject<void>();
jest.mock('rxjs', () => ({
  ...jest.requireActual('rxjs'),
  interval: () => fakeIntervalSubject,
}));

describe('NavigationComponent', () => {
  let component: NavigationComponent;

  const currentSidebar = ['item-1', 'item-2'];
  const mockNavigationService = {
    currentSidebar: currentSidebar,
    restoreSideBarOpened: jest.fn(),
    saveSideBarOpened: jest.fn(),
    addSidebarItem: jest.fn(),
    deleteSidebarItem: jest.fn(),
  };
  const mockUserService = {
    user: undefined as unknown as {username: string}
  };

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn()
  };

  const mockBreakpointObserver = {
    observe: jest.fn(() => of({matches: true}))
  };

  const dialogResult = new Subject<AddSideBarItemDialogResult>();
  const mockDialog = {
    open: jest.fn(() => ({
      afterClosed: jest.fn(() => dialogResult)
    })),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        NavigationComponent,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: NavigationService, useValue: mockNavigationService },
        IconsService,
        { provide: UserService, useValue: mockUserService },
        VersionsService,
        EnvironmentService,
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService },
        { provide: MatDialog, useValue: mockDialog },
      ]
    }).inject(NavigationComponent);
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should retore sideBarOpened', () => {
      expect(mockNavigationService.restoreSideBarOpened).toHaveBeenCalled();
    });
  });

  it('should set handset', () => {
    lastValueFrom(component.isHandset$).then((isHandset) => {
      expect(isHandset).toBe(true);
    });
  });

  it('should get icon', () => {
    const icons = ['tune', 'arrow-down', 'update', 'help', 'api', 'hub'];
    const differentResults = ['arrow_drop_down', 'help_outline'];

    let diffIndex = 0;
    icons.forEach((icon) => {
      if(icon === 'arrow-down' || icon === 'help') {
        expect(component.getIcon(icon)).toEqual(differentResults[diffIndex]);
        diffIndex += 1;
      }
      else {
        expect(component.getIcon(icon)).toEqual(icon);
      }
    });
  });
  
  it('should greet correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T10:00:00'));
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good morning');
    
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T13:00:00'));
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good afternoon');
    
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T19:00:00'));
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good evening');

    mockUserService.user = {
      username: 'user'
    };
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good evening, user');

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T10:00:00'));
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good morning, user');

    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T13:00:00'));
    fakeIntervalSubject.next();
    expect(component.greetings).toEqual('Good afternoon, user');
  });

  describe('toggle sidebar', () => {
    it('should toggle sidebar', () => {
      component.sideBarOpened = false;
      component.toggleSideBar();
      expect(component.sideBarOpened).toBeTruthy();
    });

    it('should save sidebar opened', () => {
      component.toggleSideBar();
      expect(mockNavigationService.saveSideBarOpened).toHaveBeenCalledWith(component.sideBarOpened);
    });
  });

  it('should change the position of the droped element in the navigation component array', () => {
    component.drop({ currentIndex: 1, previousIndex: 0 } as CdkDragDrop<SidebarItem[]>);
    expect(mockNavigationService.currentSidebar).toEqual(['item-2', 'item-1']);
  });

  it('should add a new item to the sidebar', () => {
    const item = 'results';
    component.addNewSideBarItem();
    dialogResult.next({ item: item });
    expect(mockNavigationService.addSidebarItem).toHaveBeenCalledWith(item);
  });

  it('should delete a sidebar item at the specified index', () => {
    const index = 1;
    component.deleteSideBarItem(index);
    expect(mockNavigationService.deleteSidebarItem).toHaveBeenCalledWith(index);
  });
});