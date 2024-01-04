import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { DataFilterService } from '@app/types/filter-definition';
import { FiltersOr } from '@app/types/filters';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilter, ApplicationRawListOptions } from './types';

describe('Application component', () => {

  let component: IndexComponent;

  const dataSample = {
    total: 3,
    applications: [
      {id: 'abc', sessions: [], partitionsId: []},
      {id: 'def', sessions: [], partitionsId: []},
      {id: 'ghi', sessions: [], partitionsId: []},
    ]
  };

  const sampleFiltersOr: FiltersOr<number, null> = [
    [
      {
        field: 1,
        for: 'root',
        operator: 1,
        value: 2
      },
      {
        field: 2,
        for: 'root',
        operator: 1,
        value: 'value'
      }
    ]
  ];

  const options: ApplicationRawListOptions = {
    pageIndex: 1,
    pageSize: 25,
    sort: {
      active: 'name',
      direction: 'asc'
    }
  };

  const intervalRefreshSubject = new Subject<number>();

  const mockApplicationIndexService = {
    availableColumns: ['name', 'namespace', 'service', 'version', 'actions', 'count'],
    columnsLabels: {
      name: $localize`Name`,
      namespace: $localize`Namespace`,
      service: $localize`Service`,
      version: $localize`Version`,
      count: $localize`Tasks by Status`,
      actions: $localize`Actions`,
    },
    restoreColumns: jest.fn(),
    saveColumns: jest.fn(),
    resetColumns: jest.fn(),
    columnToLabel: jest.fn(),
    isActionsColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    restoreOptions: jest.fn(() => options),
    restoreIntervalValue: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn()
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn()
  };

  const mockApplicationsFilterService = {
    restoreFilters: jest.fn(() => sampleFiltersOr),
    saveFilters: jest.fn(),
    resetFilters: jest.fn(),
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const mockGrpcApplicationsService = {
    list$: jest.fn()
  };

  const mockAutoRefreshService = {
    autoRefreshTooltip: jest.fn(),
    createInterval: jest.fn(() => intervalRefreshSubject),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        {provide: NotificationService, useValue: mockNotificationService },
        IconsService,
        DataFilterService,
        { provide: DATA_FILTERS_SERVICE, useValue: mockApplicationsFilterService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        { provide: ApplicationsGrpcService, useValue: mockGrpcApplicationsService },
        { provide: AutoRefreshService, useValue: mockAutoRefreshService },
      ]
    }).inject(IndexComponent);

    component.ngOnInit();
    component.ngAfterViewInit();
    component.displayedColumns = ['name', 'namespace', 'service', 'version', 'actions', 'count'];
  });
  
  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('should restore on init', () => {
    expect(mockApplicationIndexService.restoreColumns).toHaveBeenCalled();
    expect(mockApplicationIndexService.restoreOptions).toHaveBeenCalled();
    expect(mockApplicationsFilterService.restoreFilters).toHaveBeenCalled();
    expect(mockApplicationIndexService.restoreIntervalValue).toHaveBeenCalled();
    expect(mockShareUrlService.generateSharableURL).toHaveBeenCalledWith(component.options, component.filters);
    expect(component.availableColumns).toBe(mockApplicationIndexService.availableColumns);
  });

  describe('ngAfterViewInit', () => {
    mockGrpcApplicationsService.list$.mockImplementation(() => {
      return new BehaviorSubject(dataSample);
    });

    describe('on optionschange', () => {

      beforeEach(() => {
        component.options.sort.active = 'namespace';
        component.options.sort.direction = 'asc';
        component.options.pageIndex = 2;
        component.options.pageSize = 25;
      });

      it('should load data', () => {
        component.optionsChange.next();
        expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
        expect(component.total).toEqual(3);
        expect(component.data).toEqual(dataSample.applications);
      });
    });
  });

  it('should load data on user refresh', () => {
    component.refresh.next();
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(component.data).toEqual(dataSample.applications);
  });

  it('should load data on interval refresh', () => {
    intervalRefreshSubject.next(1);
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(component.data).toEqual(dataSample.applications);
  });

  it('should catch the error and have empty data', () => {
    mockGrpcApplicationsService.list$.mockImplementationOnce(() => {
      return throwError(() => new Error('Test error'));
    });

    // To prevent the error to be printed in the console
    const mockConsole = jest.spyOn(console, 'error');
    mockConsole.mockImplementationOnce(() => {});
    
    component.refresh.next();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to fetch applications');
    expect(component.data).toEqual([]);
    expect(component.total).toEqual(0);
  });

  it('should return column labels', () => {
    expect(component.columnsLabels()).toEqual(mockApplicationIndexService.columnsLabels);
  });

  it('should get page icon', () => {
    expect(component.getPageIcon('applications')).toEqual('apps');
  });

  it('should refresh', () => {
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spyRefresh).toHaveBeenCalled();
  });

  describe('onIntervalValueChange', () => {
    it('should call the application index service', () => {
      component.onIntervalValueChange(1);
      expect(mockApplicationIndexService.saveIntervalValue).toHaveBeenCalled();
    });

    it('should change the interval value', () => {
      const spyRefresh = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(10);
      expect(spyRefresh).toHaveBeenCalledWith(10);
    });

    it('should stop the interval value', () => {
      const spyStopRefresh = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spyStopRefresh).toHaveBeenCalled();
    });
  });

  it('should change columns', () => {
    const newColumns: ApplicationRawColumnKey[] = ['name', 'count', 'service'];
    component.onColumnsChange(newColumns);
    expect(component.displayedColumns).toEqual(newColumns);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  it('should reset columns', () => {
    mockApplicationIndexService.resetColumns.mockImplementationOnce(() => mockApplicationIndexService.availableColumns);
    component.onColumnsReset();
    expect(component.displayedColumns).toEqual(mockApplicationIndexService.availableColumns);
    expect(mockApplicationIndexService.resetColumns).toHaveBeenCalled();
  });

  it('should update filters', () => {
    const newFilterOr: ApplicationRawFilter = [[{
      field: 3,
      for: 'root',
      operator: 4,
      value: 'new value'
    }]];
    const spyRefresh = jest.spyOn(component.refresh, 'next');
    component.onFiltersChange(newFilterOr);
    
    expect(mockApplicationsFilterService.saveFilters).toHaveBeenCalledWith(newFilterOr);
    expect(component.options.pageIndex).toEqual(0);
    expect(spyRefresh).toHaveBeenCalled();
    expect(component.filters).toEqual(newFilterOr);
  });

  it('should reset filters', () => {
    mockApplicationsFilterService.resetFilters.mockImplementationOnce(() => []);
    component.onFiltersReset();
    expect(mockApplicationsFilterService.resetFilters).toHaveBeenCalled();
    expect(component.options.pageIndex).toEqual(0);
    expect(component.filters).toEqual([]);
  });

  it('should give the tooltip', () => {
    component.intervalValue = 13;
    component.autoRefreshTooltip();
    expect(mockAutoRefreshService.autoRefreshTooltip).toHaveBeenCalledWith(13);
  });

  it('should stop the auto-refresh', () => {
    const spyStopRefresh = jest.spyOn(component.stopInterval, 'next');
    component.intervalValue = 0;
    component.handleAutoRefreshStart();
    expect(spyStopRefresh).toHaveBeenCalled();
  });

  describe('onLockColumnsChange', () => {
    it('should switch the value of lockColumns', () => {
      component.lockColumns = false;
      component.onLockColumnsChange();
      expect(component.lockColumns).toBeTruthy();
    });

    it('should call applications index service saveLockColumns', () => {
      component.onLockColumnsChange();
      expect(mockApplicationIndexService.saveLockColumns).toHaveBeenCalledWith(component.lockColumns);
    });
  });

  it('should load data onOptionsChange', () => {
    component.onOptionsChange();
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
  });
});