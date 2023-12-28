import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ApplicationsGrpcService } from '@app/applications/services/applications-grpc.service';
import { ApplicationsIndexService } from '@app/applications/services/applications-index.service';
import { ApplicationRawFieldKey, ApplicationRawListOptions } from '@app/applications/types';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ApplicationsLineComponent } from './applications-line.component';
import { Line } from '../types';

describe('ApplicationsLineComponent', () => {
  let component: ApplicationsLineComponent;

  const options: ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'name' as ApplicationRawFieldKey,
      direction: 'desc',
    },
  };

  const line: Line = {
    name: 'Tasks',
    type: 'Applications',
    filters: [],
    interval: 20,
    options: options
  };

  const nameLine = {
    name: 'NewNameLine'
  };
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed() {
          return of(nameLine);
        }
      };
    }),
  };

  const mockGrpcApplicationsService = {
    list$: jest.fn()
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const mockApplicationsIndexService = {
    availableColumns: ['name', 'namespace', 'service', 'version', 'actions', 'count']
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: ApplicationsGrpcService, useValue: mockGrpcApplicationsService },
        AutoRefreshService,
        IconsService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ApplicationsIndexService, useValue: mockApplicationsIndexService },
        DefaultConfigService
      ]
    }).inject(ApplicationsLineComponent);
    component.line = line;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    const intervalSpy = jest.spyOn(component.interval, 'next');
    component.ngOnInit();
    expect(component.loadApplicationData).toBeTruthy();
    expect(component.filters).toBe(line.filters);
    expect(intervalSpy).toHaveBeenCalledWith(line.interval);
  });

  it('should create subscriptions after init', () => {
    component.ngOnInit();
    component.ngAfterViewInit();
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, component.filters);
  });

  it('should unsubscribe on destroy', () => {
    const subSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
  });

  it('should get icon', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });

  it('should generate an autoRefresh tooltip', () => {
    expect(component.autoRefreshTooltip()).toEqual(`Auto-refresh every ${line.interval} seconds`);
  });

  it('should refresh', () => {
    const refreshSpy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(refreshSpy).toHaveBeenCalled();
  });

  describe('onIntervalValueChange', () => {
    it('should change interval line value', () => {
      component.onIntervalValueChange(5);
      expect(component.line.interval).toEqual(5);
    });

    it('should emit on interval change', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onIntervalValueChange(5);
      expect(spy).toHaveBeenCalled();
    });

    it('should change interval value with new value', () => {
      const spyInterval = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(5);
      expect(spyInterval).toHaveBeenCalledWith(5);
    });

    it('should stop interval when the value is 0', () => {
      const spyStopInterval = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spyStopInterval).toHaveBeenCalled();
    });
  });

  it('should edit the name line', () => {
    component.onEditNameLine('NewNameLine');
    expect(component.line.name).toEqual('NewNameLine');
  });

  it('should emit on edit name line', () => {
    const spy = jest.spyOn(component.lineChange, 'emit');
    component.onEditNameLine('NewNameLine');
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on delete line', () => {
    const spy = jest.spyOn(component.lineDelete, 'emit');
    component.onDeleteLine(line);
    expect(spy).toHaveBeenCalledWith(line);
  });

  describe('onFilterChange', () => {
    const newFilters = [[{for: 'root', field: 0, operator: 1, value: 2}]];
    
    it('should update applied filters', () => {
      component.onFiltersChange(newFilters);
      expect(component.filters).toEqual(newFilters);
    });

    it('should update line filters', () => {
      component.onFiltersChange(newFilters);
      expect(component.line.filters).toEqual(newFilters);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onFiltersChange(newFilters);
      expect(spy).toHaveBeenCalled();
    });

    it('should refresh', () => {
      const spy = jest.spyOn(component.refresh, 'next');
      component.onFiltersChange(newFilters);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onOptionsChange', () => {
    it('should change line options', () => {
      const newOptions: ApplicationRawListOptions = {
        pageIndex: 2,
        pageSize: 25,
        sort: {
          active: 'service',
          direction: 'desc'
        }
      };
      component.options = newOptions;
      component.onOptionsChange();
      expect(component.line.options).toEqual(newOptions);
    });

    it('should refresh', () => {
      const spy = jest.spyOn(component.optionsChange, 'next');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });
  });
});