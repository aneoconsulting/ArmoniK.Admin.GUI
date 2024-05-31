import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableColumn } from '@app/types/column.type';
import { FiltersOr } from '@app/types/filters';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { ApplicationsFiltersService } from './services/applications-filters.service';
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

  const defaultShowFilters = false;

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
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn(() => defaultShowFilters)
  };

  const mockAutoRefreshService = {
    autoRefreshTooltip: jest.fn(),
    createInterval: jest.fn(() => intervalRefreshSubject),
  };

  const mockDashboardIndexService = {
    restoreIntervalValue: jest.fn(),
    restoreColumns: jest.fn(),
    restoreLockColumns: jest.fn(),
    restoreOptions: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveColumns: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    availableTableColumns: displayedColumns,
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        IconsService,
        { provide: ApplicationsFiltersService, useValue: mockApplicationsFilterService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        { provide: AutoRefreshService, useValue: mockAutoRefreshService },
        { provide: MatDialog, useValue:
          {
            open: () => {
              return {
                afterClosed: () => {
                  return of([]);
                }
              };
            }
          }
        },
        { provide: DashboardIndexService, useValue: mockDashboardIndexService },
        DefaultConfigService,
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
    const spyFilters = jest.spyOn(component.filters$, 'next');
    component.onFiltersChange(newFilterOr);
    
    expect(mockApplicationsFilterService.saveFilters).toHaveBeenCalledWith(newFilterOr);
    expect(component.options.pageIndex).toEqual(0);
    expect(spyFilters).toHaveBeenCalled();
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
  
  describe('onShowFiltersChange', () => {
    it('should update show filters', () => {
      const newShowFilters = true;
      component.onShowFiltersChange(newShowFilters);
      expect(component.showFilters).toEqual(newShowFilters);
    });

    it('should save show filters', () => {
      const newShowFilters = true;
      component.onShowFiltersChange(newShowFilters);
      expect(mockApplicationsFilterService.saveShowFilters).toHaveBeenCalledWith(newShowFilters);
    });
  });
});