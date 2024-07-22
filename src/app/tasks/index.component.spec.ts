import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardIndexService } from '@app/dashboard/services/dashboard-index.service';
import { TableLine } from '@app/dashboard/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { IndexComponent } from './index.component';
import { TasksFiltersService } from './services/tasks-filters.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksIndexService } from './services/tasks-index.service';
import { TaskOptions, TaskSummary } from './types';

describe('Tasks Index Component', () => {
  let component: IndexComponent;

  const mockTasksGrpcService = {
    cancel$: jest.fn(() => of()),
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

  const defaultColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'actions', 'createdAt', 'options'];
  const defaultCustomColumns: CustomColumn[] = ['options.options.FastCompute'];
  const defaultOptions: ListOptions<TaskSummary, TaskOptions> = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'createdAt',
      direction: 'desc'
    }
  };
  const availableTableColumns: TableColumn<TaskSummary, TaskOptions>[] = [
    {
      name: $localize`Task ID`,
      key: 'id',
      type: 'link',
      sortable: true,
      link: '/tasks',
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
      name: $localize`Session ID`,
      key: 'sessionId',
      sortable: true,
    },
    {
      name: $localize`Initial Task ID`,
      key: 'initialTaskId',
      sortable: true,
    },
    {
      name: $localize`Owner Pod ID`,
      key: 'ownerPodId',
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
  ];

  const defaultIntervalValue = 10;

  const defaultViewInLogs = {
    serviceIcon: 'icon',
    serviceName: 'service',
    urlTemplate: 'https://localhost:4200/taskId=%taskId',
  };

  const defaultShowFilters = false;

  const mockTasksIndexService = {
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

  const mockTaskFiltersService = {
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
        { provide: TasksIndexService, useValue: mockTasksIndexService },
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: DashboardIndexService, useValue: mockDashboardIndexService },
        { provide: Router, useValue: mockRouter },
        { provide: TasksFiltersService, useValue: mockTaskFiltersService },
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
      expect(component.availableColumns).toEqual([...availableTableColumns.map(column => column.key), ...defaultCustomColumns]);
      expect(component.customColumns).toEqual(defaultCustomColumns);
      expect(component.displayedColumns).toEqual([
        {
          name: $localize`Task ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/tasks',
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
      expect(Object.keys(component.columnsLabels).length).toEqual(availableTableColumns.length);
      expect(component.lockColumns).toEqual(false);
    });

    it('should initialise filters', () => {
      expect(component.filters).toEqual([]);
      expect(component.filters$).toBeDefined();
    });

    it('should init options', () => {
      expect(component.options).toEqual(defaultOptions);
    });

    it('should merge subscriptions', () => {
      expect(component.subscriptions).toBeDefined();
    });

    it('should initialise view in logs', () => {
      expect(component.serviceIcon).toEqual(defaultViewInLogs.serviceIcon);
      expect(component.serviceName).toEqual(defaultViewInLogs.serviceName);
      expect(component.urlTemplate).toEqual(defaultViewInLogs.urlTemplate);
    });
  });

  describe('on destroy', () => {
    it('should unsubscribe', () => {
      component.ngOnDestroy();
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
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
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onIntervalValueChange(5);
      expect(spy).toHaveBeenCalled();
    });

    it('should stop the interval if the value is 0', () => {
      const spy = jest.spyOn(component.stopInterval, 'next');
      component.onIntervalValueChange(0);
      expect(spy).toHaveBeenCalled();
    });

    it('should save the interval value', () => {
      component.onIntervalValueChange(5);
      expect(mockTasksIndexService.saveIntervalValue).toHaveBeenCalledWith(5);
    });
  });

  describe('On columns change', () => {
    const newColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'createdAt'];
    beforeEach(() => {
      component.onColumnsChange(newColumns);
    });

    it('should update displayed column keys', () => {
      expect(component.displayedColumnsKeys).toEqual(newColumns);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumns).toEqual([
        {
          name: $localize`Task ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/tasks',
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
      expect(mockTasksIndexService.saveColumns).toHaveBeenCalledWith(['id', 'createdAt']);
    });

    it('should always have "select" at position 1', () => {
      component.onColumnsChange(['id', 'createdAt', 'select']);
      expect(component.displayedColumnsKeys).toEqual(['select', 'id', 'createdAt']);
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
      expect(component.displayedColumns).toEqual([
        {
          name: $localize`Task ID`,
          key: 'id',
          type: 'link',
          sortable: true,
          link: '/tasks',
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

    const newFilters: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [
      [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: 'taskId',
          for: 'root',
        }
      ]
    ];

    let filterSpy: jest.SpyInstance;

    beforeEach(() => {
      filterSpy = jest.spyOn(component.filters$, 'next');
      component.onFiltersChange(newFilters);
    });

    it('should update filters', () => {
      expect(component.filters).toEqual(newFilters);
    });

    it('should save filters', () => {
      expect(mockTaskFiltersService.saveFilters).toHaveBeenCalledWith(newFilters);
    });

    it('should update page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });

    it('should emit filters', () => {
      expect(filterSpy).toHaveBeenCalledWith(newFilters);
    });
  });

  describe('On Filter Reset', () => {
    let filterSpy: jest.SpyInstance;

    beforeEach(() => {
      filterSpy = jest.spyOn(component.filters$, 'next');
      component.onFiltersReset();
    });

    it('should reset filters', () => {
      expect(component.filters).toEqual([]);
    });

    it('should reset page index', () => {
      expect(component.options.pageIndex).toEqual(0);
    });

    it('should emit empty filters', () => {
      expect(filterSpy).toHaveBeenCalledWith([]);
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
      expect(mockTasksIndexService.saveLockColumns).toHaveBeenCalledWith(true);
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
      expect(mockDashboardIndexService.addLine).toHaveBeenCalledWith<TableLine<TaskSummary, TaskOptions>[]>({
        name: 'Tasks',
        type: 'Tasks',
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

    it('should update available columns', () => {
      expect(component.availableColumns).toEqual([...availableTableColumns.map(column => column.key), ...newCustomColumns]);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumnsKeys).toEqual([...defaultColumns, ...newCustomColumns]);
    });

    it('should save columns', () => {
      expect(mockTasksIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumnsKeys);
    });

    it('should save custom columns', () => {
      expect(mockTasksIndexService.saveCustomColumns).toHaveBeenCalledWith(newCustomColumns);
    });
  });

  test('On Retries should change filters', () => {
    const task = {
      id: 'taskId',
    } as unknown as TaskSummary;
    component.onRetries(task);
    expect(component.filters).toEqual([
      [
        {
          field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
          value: task.id,
          for: 'root',
        }
      ]
    ]);
  });

  it('should update selection', () => {
    const selection = ['taskId1', 'taskId2'];
    component.onSelectionChange(selection);
    expect(component.selection).toEqual(selection);
  });

  describe('Cancel Tasks', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    it('should cancel tasks', () => {
      const tasks = ['taskId'];
      component.cancelTasks(tasks);
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith(tasks);
    });

    it('should notify on success', () => {
      component.cancelTasks(['taskId']);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Tasks canceled');
    });

    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.cancelTasks(['taskId']);
      expect(spy).toHaveBeenCalled();
    });

    it('should notify on errors', () => {
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.cancelTasks(['taskId']);
      expect(mockNotificationService.error).toHaveBeenCalledWith('Unable to cancel tasks');
    });

    it('should log errors', () => {
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error('Error')));
      component.cancelTasks(['taskId']);
      expect(spy).toHaveBeenCalledWith(new Error('Error'));
    });
  });

  it('should cancel selected tasks', () => {
    const selection = ['taskId1', 'taskId2'];
    component.selection = selection;
    component.onCancelTasksSelection();
    expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith(selection);
  });

  describe('Manage view in logs', () => {
    
    const newViewInLogs = {
      serviceIcon: 'newIcon',
      serviceName: 'newService',
      urlTemplate: 'https://grafana/taskId=%taskId',
    };

    beforeEach(() => {
      mockMatDialog.open.mockReturnValue({
        afterClosed: () => of(newViewInLogs)
      });
      component.manageViewInLogs();
    });

    it('should update view in logs', () => {
      expect(component.serviceIcon).toEqual(newViewInLogs.serviceIcon);
      expect(component.serviceName).toEqual(newViewInLogs.serviceName);
      expect(component.urlTemplate).toEqual(newViewInLogs.urlTemplate);
    });

    it('should save view in logs', () => {
      expect(mockTasksIndexService.saveViewInLogs).toHaveBeenCalledWith(newViewInLogs.serviceIcon, newViewInLogs.serviceName, newViewInLogs.urlTemplate);
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
      expect(mockTaskFiltersService.saveShowFilters).toHaveBeenCalledWith(newShowFilters);
    });
  });
});