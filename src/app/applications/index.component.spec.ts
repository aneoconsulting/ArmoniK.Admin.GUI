import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { DATA_FILTERS_SERVICE } from '@app/tokens/filters.token';
import { TableColumn } from '@app/types/column.type';
import { DataFilterService } from '@app/types/filter-definition';
import { FiltersOr } from '@app/types/filters';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { ApplicationsGrpcService } from './services/applications-grpc.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from './types';

describe('Application component', () => {

  let component: IndexComponent;

  const displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [
    {
      name: 'Name',
      key: 'name',
      sortable: true
    },
    {
      name: 'Namespace',
      key: 'namespace',
      sortable: true
    },
    {
      name: 'Service',
      key: 'service',
      sortable: true
    },
    {
      name: 'Version',
      key: 'version',
      sortable: true
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    },
    {
      name: 'Tasks by Status',
      key: 'count',
      type: 'count',
      sortable: true
    }
  ];

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
    availableTableColumns: displayedColumns,
    columnsLabels: {
      name: $localize`Name`,
      namespace: $localize`Namespace`,
      service: $localize`Service`,
      version: $localize`Version`,
      count: $localize`Tasks by Status`,
      actions: $localize`Actions`,
    },
    restoreColumns: jest.fn(() => displayedColumns.map(col => col.key)),
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
    expect(component.availableColumns).toEqual(displayedColumns.map(col => col.key));
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
        const data$Spy = jest.spyOn(component.data$, 'next');
        component.optionsChange.next();
        expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
        expect(component.total).toEqual(3);
        expect(data$Spy).toHaveBeenCalledWith(dataSample.applications);
      });
    });
  });

  it('should load data on user refresh', () => {
    const data$Spy = jest.spyOn(component.data$, 'next');
    component.refresh.next();
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(data$Spy).toHaveBeenCalledWith(dataSample.applications);
  });

  it('should load data on interval refresh', () => {
    const data$Spy = jest.spyOn(component.data$, 'next');
    intervalRefreshSubject.next(1);
    expect(mockGrpcApplicationsService.list$).toHaveBeenCalledWith(options, sampleFiltersOr);
    expect(component.total).toEqual(3);
    expect(data$Spy).toHaveBeenCalledWith(dataSample.applications);
  });

  it('should catch the error and have empty data', () => {
    const data$Spy = jest.spyOn(component.data$, 'next');
    mockGrpcApplicationsService.list$.mockImplementationOnce(() => {
      return throwError(() => new Error('Test error'));
    });

    // To prevent the error to be printed in the console
    const mockConsole = jest.spyOn(console, 'error');
    mockConsole.mockImplementationOnce(() => {});
    
    component.refresh.next();
    expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to fetch applications');
    expect(data$Spy).toHaveBeenCalledWith([]);
    expect(component.total).toEqual(0);
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
    expect(component.displayedColumnsKeys).toEqual(newColumns);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  it('should reset columns', () => {
    mockApplicationIndexService.resetColumns.mockImplementationOnce(() => mockApplicationIndexService.availableTableColumns.map(col => col.key));
    component.onColumnsReset();
    expect(component.displayedColumnsKeys).toEqual(mockApplicationIndexService.availableTableColumns.map(col => col.key));
    expect(mockApplicationIndexService.resetColumns).toHaveBeenCalled();
  });

  it('should update filters', () => {
    const newFilterOr: ApplicationRawFilters = [[{
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