import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Environment, EnvironmentService } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { Observable, of, Subject, throwError } from 'rxjs';
import { EnvironmentComponent } from './environment.component';

describe('EnvironmentComponent', () => { 
  let component: EnvironmentComponent;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  let mockDialogData = 'http://armonik.eu/ ';
  const mockDialog = {
    open: jest.fn(() => ({
      afterClosed: jest.fn(() => of(mockDialogData))
    })),
  };

  const mockEnv: Environment = {
    color: 'blue',
    description: 'Some description',
    name: 'test env',
    version: '0.0.1',
  };
  const mockHttpClient = {
    get: jest.fn((): Observable<Environment> => of(mockEnv)),
  };

  const mockCurrentHost: string = ''; 
  const mockEnvironmentService = {
    currentHost: mockCurrentHost as string | null,
    hosts: ['armonik.eu', 'test.fr'],
    selectHost: jest.fn(),
    addEnvironment: jest.fn(),
    removeEnvironment: jest.fn(),
  };

  const menuOpenedSubject = new Subject<void>();
  const menuClosedSubject = new Subject<void>();
  const mockTrigger = {
    menuClosed: menuClosedSubject,
    menuOpened: menuOpenedSubject,
  } as unknown as MatMenuTrigger;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        EnvironmentComponent,
        { provide: MatDialog, useValue: mockDialog },
        { provide: HttpClient, useValue: mockHttpClient },
        { provide: EnvironmentService, useValue: mockEnvironmentService },
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(EnvironmentComponent);
    component['trigger'] = mockTrigger;
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialisation', () => { 
    it('should subscribe to host$', () => {
      expect(component['host$'].observed).toBeTruthy();
    });
    
    it('should subscribe to hostList$', () => {
      expect(component['hostList$'].observed).toBeTruthy();
    });

    it('should set the defaultEnvironment', () => {
      expect(component.defaultEnvironment).toEqual(mockEnv);
    });

    it('should have made a call the default environment URL', () => {
      expect(mockHttpClient.get).toHaveBeenCalledWith('/static/environment.json');
    });

    it('should subscribe to trigger menuClosed', () => {
      expect(menuClosedSubject.observed).toBeTruthy();
    });

    it('should subscribe to trigger menuClosed', () => {
      expect(menuOpenedSubject.observed).toBeTruthy();
    });
  });

  describe('Menu events', () => { 
    it('should open menu on menuClose event', () => {
      menuOpenedSubject.next();
      expect(component.openedMenu).toBeTruthy();
    });
    
    it('should open menu on menuClose event', () => {
      menuClosedSubject.next();
      expect(component.openedMenu).toBeFalsy();
    });
  });

  it('should get icon', () => {
    const icon = 'icon';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });

  describe('Select environment', () => { 
    describe('Valid environment', () => {
      const providedHost = 'armonik.eu';
      beforeEach(() => {
        component.selectEnvironment(providedHost);
      });

      it('should set the environment signal with the provided host Environment', () => {
        expect(component.environment()).toEqual(mockEnv);
      });

      it('should select the host in the environment service', () => {
        expect(mockEnvironmentService.selectHost).toHaveBeenCalledWith(providedHost);
      });
    });

    describe('Invalid Environment', () => {
      beforeEach(() => {
        component.selectEnvironment(null);
      });

      it('should set the environment signal with the default environment', () => {
        expect(component.environment()).toBe(component.defaultEnvironment);
      });

      it('should set the environment service host as null (default)', () => {
        expect(mockEnvironmentService.selectHost).toHaveBeenCalledWith(null);
      });
    });
  });

  describe('openNewEnvDialog', () => {
    let spy: jest.SpyInstance;

    beforeEach(() => {
      spy = jest.spyOn(component['hostList$'], 'next');
      component.openNewEnvDialog();
    });

    it('should add the environment to the environment service', () => {
      expect(mockEnvironmentService.addEnvironment).toHaveBeenCalledWith(mockDialogData.trim().slice(0, -1));
    });

    it('should call the hostList subject', () => {
      expect(spy).toHaveBeenCalled();
    });
  });
  
  describe('deleteEnv', () => {
    const host = 'some-host';
    let spyHostList: jest.SpyInstance;
    let spySelectEnvironment: jest.SpyInstance;

    beforeEach(() => {
      mockEnvironmentService.currentHost = host;
      mockDialogData = host;
      spyHostList = jest.spyOn(component['hostList$'], 'next');
      spySelectEnvironment = jest.spyOn(component, 'selectEnvironment');
      component.deleteEnv(host);
    });
    
    it('should delete the host from the environment service host list', () => {
      expect(mockEnvironmentService.removeEnvironment).toHaveBeenCalledWith(host);
    });

    it('should call the hostList subject', () => {
      expect(spyHostList).toHaveBeenCalled();      
    });

    it('should select the default environment if the deleted host is the currently selected one', () => {
      expect(spySelectEnvironment).toHaveBeenCalled();
    });
  });

  it('should handle a invalid-host', () => {
    mockHttpClient.get.mockReturnValueOnce(throwError(() => new Error()));
    mockEnvironmentService.currentHost = null;
    component['host$'].next();
    expect(component.environment()).toEqual({
      color: 'red',
      description: 'Unknown',
      name: 'Unknown',
      version: 'Unknown',
    });
  });
});