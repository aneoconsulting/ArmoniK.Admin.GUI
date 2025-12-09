import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectorRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
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
    toggleSidebarOpened: jest.fn(),
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
  const mockUserConnectedGuard = {
    canActivate: jest.fn(() => false)
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
  };

  const mockChangeDetectorRef = {
    markForCheck: jest.fn(),
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
        { provide: UserConnectedGuard, useValue: mockUserConnectedGuard },
        { provide: Router, useValue: mockRouter },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ]
    }).inject(NavigationComponent);
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
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
  

  it('should toggle navigation service sidebar opened', () => {
    component.toggleSidebar();
    expect(mockNavigationService.toggleSidebarOpened).toHaveBeenCalled();
  });

  it('should change the position of the droped element in the navigation component array', () => {
    component.drop({ currentIndex: 1, previousIndex: 0 } as CdkDragDrop<SidebarItem[]>);
    expect(mockNavigationService.currentSidebar).toEqual(['item-2', 'item-1']);
  });

  describe('addNewSideBarItem', () => {
    const item = 'results';
    beforeEach(() => {
      component.addNewSideBarItem();
      dialogResult.next({ item: item });
    });

    it('should add a new item to the sidebar', () => {
      expect(mockNavigationService.addSidebarItem).toHaveBeenCalledWith(item);
    });

    it('should refresh the view', () => {
      expect(mockChangeDetectorRef.markForCheck).toHaveBeenCalled();
    });
  });

  it('should delete a sidebar item at the specified index', () => {
    const index = 1;
    component.deleteSideBarItem(index);
    expect(mockNavigationService.deleteSidebarItem).toHaveBeenCalledWith(index);
  });

  describe('profile button', () => {
    it('should disable profile button when user is not connected', () => {
      mockUserConnectedGuard.canActivate.mockReturnValue(false);
      component.updateUserConnectionStatus();
      expect(component.isProfileButtonDisabled()).toBe(true);
    });

  });
});