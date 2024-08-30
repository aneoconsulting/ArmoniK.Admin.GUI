import { BreakpointObserver } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, lastValueFrom, of } from 'rxjs';
import { ExternalService } from '@app/types/external-service';
import { DefaultConfigService } from '@services/default-config.service';
import { EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { StorageService } from '@services/storage.service';
import { UserService } from '@services/user.service';
import { VersionsService } from '@services/versions.service';
import { NavigationComponent } from './navigation.component';
import pkg from '../../../../package.json';

describe('NavigationComponent', () => {
  let component: NavigationComponent;

  let dialogRefSubject: BehaviorSubject<ExternalService[] | null>;
  const currentSidebar = ['item-1', 'item-2'];
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return dialogRefSubject;
        }
      };
    })
  };
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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        NavigationComponent,
        { provide: BreakpointObserver, useValue: mockBreakpointObserver },
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MatDialog, useValue: mockMatDialog },
        IconsService,
        { provide: UserService, useValue: mockUserService },
        VersionsService,
        EnvironmentService,
        DefaultConfigService,
        { provide: StorageService, useValue: mockStorageService },
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

  describe('getVersion', () => {
    it('should get production version', () => {
      process.env['NODE_ENV'] = 'production';
      expect(component.getVersion()).toEqual(pkg.version);
    });

    it('should get development version', () => {
      process.env['NODE_ENV'] = 'development';
      expect(component.getVersion()).toEqual('-dev');
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
  
  it('should greet correctly', () => {
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T10:00:00'));
    expect(component.greeting()).toEqual('Good morning');
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T12:00:00'));
    expect(component.greeting()).toEqual('Good afternoon');
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T18:00:00'));
    expect(component.greeting()).toEqual('Good evening');

    mockUserService.user = {
      username: 'user'
    };
    expect(component.greeting()).toEqual('Good evening, user');
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T10:00:00'));
    expect(component.greeting()).toEqual('Good morning, user');
    jest.useFakeTimers().setSystemTime(new Date('2020-01-01T12:00:00'));
    expect(component.greeting()).toEqual('Good afternoon, user');
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
});