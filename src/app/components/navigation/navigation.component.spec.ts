import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserConnectedGuard } from '@app/profile/guards/user-connected.guard';
import { DefaultConfigService } from '@services/default-config.service';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { Subject, lastValueFrom, of } from 'rxjs';
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

  const mockUserConnectedGuard = {
    canActivate: jest.fn(() => false)
  };

  const mockRouter = {
    navigateByUrl: jest.fn(),
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
        { provide: UserConnectedGuard, useValue: mockUserConnectedGuard },
        { provide: Router, useValue: mockRouter },
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

  it('should get sideBar', () => {
    expect(component.sidebar).toEqual(currentSidebar);
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

  describe('profile button', () => {
    it('should disable profile button when user is not connected', () => {
      mockUserConnectedGuard.canActivate.mockReturnValue(false);
      component.updateUserConnectionStatus();
      expect(component.isProfileButtonDisabled()).toBe(true);
    });

  });
});