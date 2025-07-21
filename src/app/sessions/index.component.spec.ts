import { FilterStringOperator, SessionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableLine } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { of } from 'rxjs';
import { IndexComponent } from './index.component';
import { SessionsDataService } from './services/sessions-data.service';
import { SessionsFiltersService } from './services/sessions-filters.service';
import { SessionsIndexService } from './services/sessions-index.service';
import { SessionRaw } from './types';

describe('Sessions Index Component', () => {
  let component: IndexComponent;

  const mockSessionsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    onPause: jest.fn(),
    onResume: jest.fn(),
    onCancel: jest.fn(),
    onPurge: jest.fn(),
    onClose: jest.fn(),
    onDelete: jest.fn(),
  };

  const newCustomColumns: CustomColumn[] = ['options.options.FastCompute', 'options.options.NewCustom'];

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: (): unknown => of(newCustomColumns)
      };
    })
  };

  const mockDashboardIndexService = {
    addLine: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  const defaultColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'actions', 'createdAt', 'options'];
  const defaultCustomColumns: CustomColumn[] = ['options.options.FastCompute'];
  const defaultOptions: ListOptions<SessionRaw, TaskOptions> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'createdAt',
      direction: 'desc'
    }
  };
  const availableTableColumns: TableColumn<SessionRaw, TaskOptions>[] = [
    {
      name: $localize`Session ID`,
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: $localize`Created at`,
      key: 'createdAt',
      type: 'date',
      sortable: true,
    },
    {
      name: $localize`Actions`,
      key: 'actions',
      type: 'actions',
      sortable: false,
    },
    {
      name: $localize`Client Submission`,
      key: 'clientSubmission',
      sortable: true,
    },
    {
      name: $localize`Options`,
      key: 'options',
      type: 'object',
      sortable: false,
    },
    {
      name: $localize`Application Version`,
      key: 'options.applicationVersion',
      sortable: true,
    },
    {
      name: $localize`Application Namespace`,
      key: 'options.applicationNamespace',
      sortable: true,
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
  ];

  const defaultIntervalValue = 10;

  const defaultViewInLogs = {
    serviceIcon: 'icon',
    serviceName: 'service',
    urlTemplate: 'https://localhost:4200/sessionId=%sessionId',
  };

  const defaultShowFilters = false;

  const mockSessionsIndexService = {
    restoreViewInLogs: jest.fn(() => defaultViewInLogs),
    saveViewInLogs: jest.fn(),
    restoreIntervalValue: jest.fn(() => defaultIntervalValue),
    saveIntervalValue: jest.fn(),
    restoreColumns: jest.fn(() => [...defaultColumns, ...defaultCustomColumns]),
    saveColumns: jest.fn(),
    availableTableColumns,
    restoreLockColumns: jest.fn(() => false),
    saveLockColumns: jest.fn(),
    restoreOptions: jest.fn(() => defaultOptions),
    saveOptions: jest.fn(),
    resetColumns: jest.fn(() => defaultColumns),
    restoreCustomColumns: jest.fn(() => defaultCustomColumns),
    saveCustomColumns: jest.fn(),
  };

  const mockSessionFiltersService = {
    restoreFilters: jest.fn(() => []),
    saveFilters: jest.fn(),
    resetFilters: jest.fn(() => []),
    saveShowFilters: jest.fn(),
    restoreShowFilters: jest.fn(() => defaultShowFilters),
  };
  
  const mockShareUrlService = {
    generateSharableURL: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        IndexComponent,
        IconsService,
        AutoRefreshService,
        { provide: SessionsIndexService, useValue: mockSessionsIndexService },
        { provide: SessionsDataService, useValue: mockSessionsDataService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: DashboardIndexService, useValue: mockDashboardIndexService },
        { provide: Router, useValue: mockRouter },
        { provide: SessionsFiltersService, useValue: mockSessionFiltersService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: NotificationService, useValue: mockNotificationService },
      ]
    }).inject(IndexComponent);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update columns keys', () => {
    component.updateDisplayedColumns();
    expect(component.displayedColumnsKeys).toEqual([...defaultColumns, ...defaultCustomColumns]);
  });

  describe('initialisation', () => {
    it('should initialise columns (with customs)', () => {
      expect(component.displayedColumnsKeys).toEqual([...defaultColumns, ...defaultCustomColumns]);
      expect(component.availableColumns).toEqual(availableTableColumns);
      expect(component.customColumns).toEqual(defaultCustomColumns);
      expect(component.displayedColumns()).toEqual([
        {
          name: $localize`Session ID`,
          key: 'sessionId',
          type: 'link',
          sortable: true,
          link: '/sessions',
        },
        {
          name: $localize`Actions`,
          key: 'actions',
          type: 'actions',
          sortable: false,
        },
        {
          name: $localize`Created at`,
          key: 'createdAt',
          type: 'date',
          sortable: true,
        },
        {
          name: $localize`Options`,
          key: 'options',
          type: 'object',
          sortable: false,
        },
        {
          name: 'FastCompute',
          key: 'options.options.FastCompute',
          sortable: true,
        }
      ]);
      expect(Object.keys(component.columnsLabels)).toEqual(availableTableColumns.map(column => column.key));
      expect(component.lockColumns).toEqual(false);
    });

    it('should initialise filters', () => {
      expect(component.filters).toEqual([]);
    });

    it('should init options', () => {
      expect(component.options).toEqual(defaultOptions);
    });

    it('should merge subscriptions', () => {
      expect(component.subscriptions).toBeDefined();
    });
  });

  describe('on destroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });

  it('should load properly', () => {
    expect(component.loading).toEqual(mockSessionsDataService.loading);
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    component.refresh();
    expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(mockSessionsIndexService.saveOptions).toHaveBeenCalledWith(mockSessionsDataService.options);
    });

    it('should refresh', () => {
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
    });
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
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
    });

    it('should stop the interval if the value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spy).toHaveBeenCalled();
    });

    it('should save the interval value', () => {
      component.onIntervalValueChange(5);
      expect(mockSessionsIndexService.saveIntervalValue).toHaveBeenCalledWith(5);
    });
  });

  describe('On columns change', () => {
    const newColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['sessionId', 'createdAt', 'select'];
    beforeEach(() => {
      component.onColumnsChange(newColumns);
    });

    it('should update displayed column keys', () => {
      expect(component.displayedColumnsKeys).toEqual(['select', 'sessionId', 'createdAt']);
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
          name: $localize`Session ID`,
          key: 'sessionId',
          type: 'link',
          sortable: true,
          link: '/sessions',
        },
        {
          name: $localize`Created at`,
          key: 'createdAt',
          type: 'date',
          sortable: true,
        },
      ]);
    });

    it('should save columns', () => {
      expect(mockSessionsIndexService.saveColumns).toHaveBeenCalledWith(['select', 'sessionId', 'createdAt']);
    });

    it('should refresh if duration is included', () => {
      component.onColumnsChange(['duration']);
      expect(mockSessionsDataService.refresh$.next).toHaveBeenCalled();
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
          name: $localize`Session ID`,
          key: 'sessionId',
          type: 'link',
          sortable: true,
          link: '/sessions',
        },
        {
          name: $localize`Actions`,
          key: 'actions',
          type: 'actions',
          sortable: false,
        },
        {
          name: $localize`Created at`,
          key: 'createdAt',
          type: 'date',
          sortable: true,
        },
        {
          name: $localize`Options`,
          key: 'options',
          type: 'object',
          sortable: false,
        },
      ]);
    });
  });

  describe('On Filters Change', () => {

    const newFilters: FiltersOr<SessionRawEnumField, TaskOptionEnumField> = [
      [
        {
          field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'sessionId',
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
      expect(mockSessionFiltersService.saveFilters).toHaveBeenCalledWith(newFilters);
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
      expect(component.filters).toEqual([]);
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
      expect(mockSessionsIndexService.saveLockColumns).toHaveBeenCalledWith(true);
    });
  });

  it('should get auto refresh tooltip', () => {
    const tooltip = component.autoRefreshTooltip();
    expect(tooltip).toEqual(`Auto-refresh every ${defaultIntervalValue} seconds`);
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
      expect(mockDashboardIndexService.addLine).toHaveBeenCalledWith<TableLine<SessionRaw, TaskOptions>[]>({
        name: 'Sessions',
        type: 'Sessions',
        interval: 10,
        showFilters: false,
        lockColumns: false,
        displayedColumns: [...defaultColumns, ...defaultCustomColumns],
        customColumns: defaultCustomColumns,
        options: defaultOptions,
        filters: [],
      });
    });
  });

  describe('addCustomColumns', () => {
    beforeEach(() => {
      component.addCustomColumn();
    });

    it('should add custom columns throught dialog', () => {
      expect(component.customColumns).toEqual(newCustomColumns);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumnsKeys).toEqual([...defaultColumns, ...newCustomColumns]);
    });

    it('should save columns', () => {
      expect(mockSessionsIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumnsKeys);
    });

    it('should save custom columns', () => {
      expect(mockSessionsIndexService.saveCustomColumns).toHaveBeenCalledWith(newCustomColumns);
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
      expect(mockSessionFiltersService.saveShowFilters).toHaveBeenCalledWith(newShowFilters);
    });
  });
});