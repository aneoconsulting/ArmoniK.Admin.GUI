import { ApplicationRawEnumField, FilterStringOperator } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { ShareUrlService } from '@services/share-url.service';
import { Subject, of } from 'rxjs';
import { IndexComponent } from './index.component';
import ApplicationsDataService from './services/applications-data.service';
import { ApplicationsFiltersService } from './services/applications-filters.service';
import { ApplicationsIndexService } from './services/applications-index.service';
import { ApplicationRaw } from './types';

describe('Application component', () => {
  let component: IndexComponent;

  const defaultColumns: ColumnKey<ApplicationRaw>[] = ['name', 'version', 'actions'];
  const displayedColumns: TableColumn<ApplicationRaw>[] = [
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
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
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

  const intervalRefreshSubject = new Subject<number>();

  const defaultShowFilters = false;
  const defaultLockColumns = false;
  const defaultIntervalValue = 10;

  const defaultOptions: ListOptions<ApplicationRaw> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'name',
      direction: 'desc'
    }
  };
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
    resetColumns: jest.fn(() => defaultColumns),
    columnToLabel: jest.fn(),
    isActionsColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    restoreOptions: jest.fn(() => defaultOptions),
    restoreIntervalValue: jest.fn(() => defaultIntervalValue),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn(() => defaultLockColumns),
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn()
  };

  const defaultFilters : FiltersOr<ApplicationRawEnumField> = [];
  const mockApplicationsFilterService = {
    restoreFilters: jest.fn(() => sampleFiltersOr),
    saveFilters: jest.fn(),
    resetFilters: jest.fn(() => defaultFilters),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn(() => defaultShowFilters)
  };


  const intervalMessage = 'interval message';
  const mockAutoRefreshService = {
    autoRefreshTooltip: jest.fn((value: string) => intervalMessage + value),
    createInterval: jest.fn(() => intervalRefreshSubject),
  };

  const mockDashboardIndexService = {
    addLine: jest.fn(),
  };

  const mockApplicationsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        IconsService,
        { provide: ApplicationsFiltersService, useValue: mockApplicationsFilterService },
        { provide: ApplicationsDataService, useValue: mockApplicationsDataService },
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
        { provide: Router, useValue: mockRouter },
        DefaultConfigService,
      ]
    }).inject(IndexComponent);

    component.ngOnInit();
    component.ngAfterViewInit();
  });
  
  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('should load properly', () => {
    expect(component.loading).toEqual(mockApplicationsDataService.loading);
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
    expect(component.getIcon('applications')).toEqual('apps');
  });

  it('should refresh', () => {
    component.refresh();
    expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On interval value change', () => {
    it('should update intervalValue', () => {
      component.onIntervalValueChange(5);
      expect(component.intervalValue).toEqual(5);
    });

    it('should update interval observer', () => {
      const spy = jest.spyOn(component.interval, 'next');
      component.onIntervalValueChange(5);
      expect(spy).toHaveBeenCalledWith(5);
    });

    it('should refresh if the value is not null', () => {
      component.onIntervalValueChange(5);
      expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
    });

    it('should stop the interval if the value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spy).toHaveBeenCalled();
    });

    it('should save the interval value', () => {
      component.onIntervalValueChange(5);
      expect(mockApplicationIndexService.saveIntervalValue).toHaveBeenCalledWith(5);
    });
  });

  describe('On columns change', () => {
    const newColumns: ColumnKey<ApplicationRaw>[] = ['name', 'count', 'select'];
    beforeEach(() => {
      component.onColumnsChange(newColumns);
    });

    it('should update displayed column keys', () => {
      expect(component.displayedColumnsKeys).toEqual(['select', 'name', 'count']);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumns()).toEqual([
        {
          name: $localize`Select`,
          key: 'select',
          type: 'select',
          sortable: false,
        },
        {
          name: $localize`Name`,
          key: 'name',
          sortable: true,
        },
        {
          name: $localize`Tasks by Status`,
          key: 'count',
          type: 'count',
          sortable: true,
        },
      ]);
    });

    it('should save columns', () => {
      expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(['select', 'name', 'count']);
    });
  });

  describe('On Columns Reset', () => {
    beforeEach(() => {
      component.onColumnsReset();
    });

    it('should reset columns', () => {
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumns()).toEqual([
        {
          name: 'Name',
          key: 'name',
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
      ]);
    });
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(mockApplicationIndexService.saveOptions).toHaveBeenCalledWith(mockApplicationsDataService.options);
    });

    it('should refresh', () => {
      expect(mockApplicationsDataService.refresh$.next).toHaveBeenCalled();
    });
  });

  describe('On Filters Change', () => {
    const newFilters: FiltersOr<ApplicationRawEnumField> = [
      [
        {
          field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'name',
          for: 'root',
        }
      ]
    ];
    beforeEach(() => {
      component.onFiltersChange(newFilters);
    });

    it('should update filters', () => {
      expect(component.filters).toEqual(newFilters);
    });

    it('should save filters', () => {
      expect(mockApplicationsFilterService.saveFilters).toHaveBeenCalledWith(newFilters);
    });

    it('should update page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });
  });

  describe('On Filter Reset', () => {
    beforeEach(() => {
      component.onFiltersReset();
    });

    it('should reset filters', () => {
      expect(component.filters).toEqual(defaultFilters);
    });

    it('should reset page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });
  });

  describe('On lockColumns Change', () => {
    beforeEach(() => {
      component.onLockColumnsChange();
    });

    it('should update lockColumn value', () => {
      expect(component.lockColumns).toBeTruthy();
    });

    it('should save lockColumns', () => {
      expect(mockApplicationIndexService.saveLockColumns).toHaveBeenCalledWith(true);
    });
  });

  it('should get auto refresh tooltip', () => {
    const tooltip = component.autoRefreshTooltip();
    expect(tooltip).toEqual(intervalMessage + defaultIntervalValue);
  });

  describe('handleAutoRefreshStart', () => {
    it('should start interval if interval value is not 0', () => {
      const spy = jest.spyOn(component.interval, 'next');
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalledWith(component.intervalValue);
    });

    it('should stop interval if interval value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.intervalValue = 0;
      component.handleAutoRefreshStart();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Adding table as a line to dashboard', () => {
    it('should add a line', () => {
      component.onAddToDashboard();
      expect(mockDashboardIndexService.addLine).toHaveBeenCalledWith({
        name: 'Applications',
        type: 'Applications',
        interval: defaultIntervalValue,
        showFilters: defaultShowFilters,
        lockColumns: false,
        displayedColumns: component.displayedColumnsKeys,
        options: defaultOptions,
        filters: component.filters,
      });
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