import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Environment, EnvironmentService, Host } from '@services/environment.service';
import { IconsService } from '@services/icons.service';
import { Observable, of, Subject, throwError } from 'rxjs';
import { EnvironmentComponent } from './environment.component';

describe('EnvironmentComponent', () => { 
  let component: EnvironmentComponent;

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  let mockDialogData = {
    endpoint: 'http://armonik.eu/ ',
    environment: {
      name: 'armonik',
      version: 'europe',
      description: '',
      color: 'orange'
    }
  } as Host;
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

  const mockCurrentHost: Host = {
    endpoint: '',
    environment: undefined,
  }; 
  const mockEnvironmentService = {
    currentHost: mockCurrentHost as Host | null,
    hosts: [
      {
        endpoint: 'armonik.eu',
        environment: {
          name: 'armonik',
          version: 'europe',
          description: 'description',
          color: 'orange'
        }
      },
      {
        endpoint: 'test.fr',
      }
    ],
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
    jest.replaceProperty(
      component,
      'trigger' as unknown as keyof EnvironmentComponent,
      mockTrigger as unknown as Environment // Since trigger is private, MatMenuTrigger is not accepted as a "valid" type.
    );
    mockEnvironmentService.currentHost = mockCurrentHost;
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

    it('should set the defaultEnvironment', () => {
      expect(component.defaultEnvironment).toEqual(mockEnv);
    });

    it('should not set the defaultEnvironmentError to true if there is no error', () => {
      expect(component.defaultEnvironmentError).toBeFalsy();
    });

    it('should set the defaultEnvironmentError to true if there is an error', () => {
      mockHttpClient.get.mockReturnValueOnce(throwError(() => new Error()));
      component.ngOnInit();
      expect(component.defaultEnvironmentError).toBeTruthy();
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

    describe('With complete environment information', () => {
      beforeEach(() => {
        mockEnvironmentService.currentHost = mockEnvironmentService.hosts[0] as Host;
        component.ngOnInit();
      });

      it('should set the environment as the one provided by the host object', () => {
        expect(component.environment()).toEqual(mockEnvironmentService.hosts[0].environment);
      });

      it('should not call the environment URL', () => {
        expect(mockHttpClient.get).not.toHaveBeenCalledWith(mockEnvironmentService.hosts[0].endpoint + '/static/environment.json');
      });
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
      const providedHost = {
        endpoint: 'armonik.eu',
        environment: {
          name: 'armonik',
          version: 'europe',
          description: 'description',
          color: 'green'
        }
      };

      beforeEach(() => {
        component.selectEnvironment(providedHost);
      });

      it('should set the environment signal with the provided host Environment', () => {
        expect(component.environment()).toEqual(providedHost.environment);
      });

      it('should select the host in the environment service', () => {
        expect(mockEnvironmentService.selectHost).toHaveBeenCalledWith(providedHost);
      });
    });

    describe('Valid but incomplete environment', () => {
      const providedHost = {
        endpoint: 'armonik.eu',
      } as Host;
      
      beforeEach(() => {
        component.selectEnvironment(providedHost);
      });

      it('should select the host in the environment service', () => {
        expect(mockEnvironmentService.selectHost).toHaveBeenCalledWith(providedHost);
      });

      it('should complete the environment with the completeEnv function', () => {
        expect(component.environment()).toEqual(component['partialToCompleteEnv'](null));
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
    describe('With host that was not already listed', () => {
      beforeEach(() => {
        component.openNewEnvDialog();
      });

      it('should add the environment to the environment service', () => {
        expect(mockEnvironmentService.addEnvironment).toHaveBeenCalledWith(mockDialogData);
      });

      it('should trim the dialog data', () => {
        expect(mockDialogData.endpoint).toEqual('http://armonik.eu');
      });
    });

    describe('With host that is already listed', () => {
      beforeEach(() => {
        mockDialogData.endpoint = 'test.fr';
        component.openNewEnvDialog();
      });

      it('should remove the environment from the environment service', () => {
        expect(mockEnvironmentService.removeEnvironment).toHaveBeenCalledWith(mockEnvironmentService.hosts[1]);
      });

      it('should add the environment to the environment service', () => {
        expect(mockEnvironmentService.addEnvironment).toHaveBeenCalledWith(mockDialogData);
      });
    });

    it('should not add an empty string', () => {
      mockDialogData.endpoint = '';
      component.openNewEnvDialog();
      expect(mockEnvironmentService.addEnvironment).not.toHaveBeenCalled();
    });
  });
  
  describe('deleteEnv', () => {
    const host = {
      endpoint: 'some-host',
    } as Host;
    let spySelectEnvironment: jest.SpyInstance;

    beforeEach(() => {
      mockEnvironmentService.currentHost = host;
      mockDialogData = host;
      spySelectEnvironment = jest.spyOn(component, 'selectEnvironment');
      component.deleteEnv(host);
    });
    
    it('should delete the host from the environment service host list', () => {
      expect(mockEnvironmentService.removeEnvironment).toHaveBeenCalledWith(host);
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

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    expect(component['subscriptions'].closed).toBeTruthy();
  });
});