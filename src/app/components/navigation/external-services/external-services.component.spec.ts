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

    it('should save services', () => {
      expect(mockNavigationService.saveExternalServices).toHaveBeenCalled();
    });
  });

  test('saveServices should save local services', () => {
    component.saveServices();
    expect(mockNavigationService.saveExternalServices).toHaveBeenCalledWith(component.externalServices);
  });
});