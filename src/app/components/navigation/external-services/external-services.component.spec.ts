import { URL } from 'url';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ExternalService } from '@app/types/external-service';
import { IconsService } from '@services/icons.service';
import { NavigationService } from '@services/navigation.service';
import { ExternalServicesComponent } from './external-services.component';

describe('ExternalServicesComponent', () => {
  let component: ExternalServicesComponent;

  const savedServices: ExternalService[] = [{name: 'grafana', url: 'https://grafana'}, {name: 'seq', url: 'https://seq'}];
  const mockNavigationService = {
    saveExternalServices: jest.fn(),
    restoreExternalServices: jest.fn(() => savedServices)
  };

  let dialogResult: ExternalService[];
  const mockMatDialog = {
    open: () => {
      return {
        afterClosed: () => {
          return of(dialogResult);
        }
      };
    }
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ExternalServicesComponent,
        IconsService,
        { provide: NavigationService, useValue: mockNavigationService },
        { provide: MatDialog, useValue: mockMatDialog }
      ]
    }).inject(ExternalServicesComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load saved services', () => {
      expect(mockNavigationService.restoreExternalServices).toHaveBeenCalled();
    });

    it('should retrieve saved services', () => {
      expect(component.externalServices).toEqual(savedServices);
    });

    it('should check if it has a service', () => {
      expect(component.hasService).toBeTruthy();
    });
  });

  it('should check if there is no service', () => {
    component.externalServices = [];
    expect(component.hasService).toBeFalsy();
  });

  it('should get icon', () => {
    expect(component.getIcon('heart')).toEqual('favorite');
  });

  describe('manageExternalService', () => {
    const newServices: ExternalService[] = [{name: 'api', url: 'https://url'}];
    dialogResult = newServices;

    beforeEach(() => {
      component.manageExternalServices();
    });

    it('should update "externalServices"', () => {
      expect(component.externalServices).toEqual(newServices);
    });

    it('should update "hasServices"', () => {
      expect(component.hasService).toBeTruthy();
    });

    it('should save services', () => {
      expect(mockNavigationService.saveExternalServices).toHaveBeenCalled();
    });
  });

  test('saveServices should save local services', () => {
    component.saveServices();
    expect(mockNavigationService.saveExternalServices).toHaveBeenCalled();
  });

  it('should allow to navigate to an url', () => {
    const windowSpy = jest.spyOn(window, 'open');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    windowSpy.mockImplementationOnce((url?: string | URL | null, target?: string | null, features?: string | undefined) => null);
    const url = 'https://url';
    component.navigate(url);
    expect(windowSpy).toHaveBeenCalledWith(url, '_blank');
  });
});