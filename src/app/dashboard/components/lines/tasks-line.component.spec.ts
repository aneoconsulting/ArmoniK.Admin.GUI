import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, throwError } from 'rxjs';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskSummaryColumnKey, TaskSummaryFieldKey, TaskSummaryListOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { CustomColumn } from '@app/types/data';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksLineComponent } from './tasks-line.component';
import { Line } from '../../types';

describe('TasksLineComponent', () => {
  let component: TasksLineComponent;

  const defaultConfigService = new DefaultConfigService();

  const defaultColumns: TaskSummaryColumnKey[] = ['id', 'options.applicationName', 'actions', 'status'];
  const customColumns: CustomColumn[] = ['options.options.FastCompute'];

  const displayedColumns: TableColumn<TaskSummaryColumnKey>[] = [
    {
      key: 'id',
      name: 'ID',
      type: 'link',
      link: '/tasks/',
      sortable: true
    },
    {
      key: 'options.applicationName',
      name: 'Application Name',
      type: 'object',
      sortable: true
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true
    }
  ];

  const options: TaskSummaryListOptions = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'name' as TaskSummaryFieldKey,
      direction: 'desc',
    },
  };

  const line: Line = {
    name: 'Tasks',
    type: 'Tasks',
    displayedColumns: [...displayedColumns.map(c => c.key), ...customColumns],
    filters: [],
    interval: 20,
    options: options,
    showFilters: false,
  };

  const nameLine = {
    name: 'NewNameLine'
  };
  const mockMatDialog = {
    open: jest.fn((): unknown => {
      return {
        afterClosed() {
          return of(nameLine);
        }
      };
    }),
  };

  const viewInLogs = {
    serviceIcon: 'icon',
    serviceName: 'name',
    urlTemplate: 'url',
  };

  const mockTasksIndexService = {
    availableTableColumns: displayedColumns,
    defaultColumns: defaultColumns,
    resetColumns: jest.fn(() => new DefaultConfigService().defaultTasks.columns),
    restoreColumns: jest.fn(() => ['name', 'count']),
    restoreViewInLogs: jest.fn(() => viewInLogs)
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockTasksGrpcService = {
    cancel$: jest.fn((): Observable<unknown> => of({})),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: TasksIndexService, useValue: mockTasksIndexService },
        DefaultConfigService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
      ]
    }).inject(TasksLineComponent);
    component.line = line;
    component.selection = [];
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('should init with line values', () => {
      const intervalSpy = jest.spyOn(component.interval, 'next');
      component.ngOnInit();
      expect(component.loading).toBeTruthy();
      expect(component.filters).toBe(line.filters);
      expect(intervalSpy).toHaveBeenCalledWith(line.interval);
    });

    it('should init with default values', () => {
      component.line = {
        ...line,
        displayedColumns: undefined,
        interval: undefined as unknown as number,
        options: undefined,
      };
      component.ngOnInit();
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
      expect(component.intervalValue).toEqual(10);
      expect(component.options).toEqual(defaultConfigService.defaultTasks.options);
      expect(component.showFilters).toEqual(line.showFilters);
    });

    it('should init with default showFilters', () => {
      component.line.showFilters = undefined as unknown as boolean;
      component.ngOnInit();
      expect(component.showFilters).toEqual(defaultConfigService.defaultTasks.showFilters);
    });
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
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onIntervalValueChange(5);
      expect(lineSpy).toHaveBeenCalled();
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

  it('should emit on edit name line', () => {
    const spy = jest.spyOn(component.lineChange, 'emit');
    component.onEditNameLine();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on delete line', () => {
    const spy = jest.spyOn(component.lineDelete, 'emit');
    component.onDeleteLine();
    expect(spy).toHaveBeenCalledWith(component.line);
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
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onFiltersChange(newFilters);
      expect(lineSpy).toHaveBeenCalled();
    });

    it('should refresh', () => {
      const spyFilters = jest.spyOn(component.filters$, 'next');
      component.onFiltersChange(newFilters);
      expect(spyFilters).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: TaskSummaryColumnKey[] = ['id', 'acquiredAt', 'creationToEndDuration'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['count', 'id'] as TaskSummaryColumnKey[];
      component.line.displayedColumns = ['id', 'podReserved'] as TaskSummaryColumnKey[];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(newColumns);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(newColumns);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(newColumns);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    beforeEach(() => {
      component.displayedColumnsKeys = ['preemptionPercentage', 'id'] as TaskSummaryColumnKey[];
      component.line.displayedColumns = ['count', 'actions'] as TaskSummaryColumnKey[];
    });

    it('should reset to default columns', () => {
      component.onColumnsReset();
      expect(component.displayedColumnsKeys).toEqual(defaultColumns);
    });

    it('should reset line displayedColumns', () => {
      component.onColumnsReset();
      expect(component.line.displayedColumns).toEqual(defaultColumns);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsReset();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onFiltersReset', () => {

    beforeEach(() => {
      component.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
      component.line.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
    });

    it('should reset filters', () => {
      component.onFiltersReset();
      expect(component.filters).toEqual([]);
    });

    it('should reset line filters', () => {
      component.onFiltersReset();
      expect(component.line.filters).toEqual([]);
    });

    it('should emit', () => {
      const lineSpy = jest.spyOn(component.lineChange, 'emit');
      component.onFiltersReset();
      expect(lineSpy).toHaveBeenCalled();
    });

    it('should refresh', () => {
      const spyFilters = jest.spyOn(component.filters$, 'next');
      component.onFiltersReset();
      expect(spyFilters).toHaveBeenCalled();
    });
  });

  describe('onLockColumnChange', () => {
    beforeEach(() => {
      component.lockColumns = true;
      component.line.lockColumns = true;
    });

    it('should toggle lockColumns', () => {
      component.onLockColumnsChange();
      expect(component.lockColumns).toBeFalsy();
    });

    it('should toggle line lockColumns', () => {
      component.onLockColumnsChange();
      expect(component.line.lockColumns).toBeFalsy();
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onLockColumnsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  it('should update selection', () => {
    const selection = ['1', '2'];
    component.onSelectionChange(selection);
    expect(component.selection).toEqual(selection);
  });

  describe('cancelTasks', () => {
    it('should cancel task', () => {
      const tasksIds = ['1', '2'];
      component.cancelTasks(tasksIds);
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith(tasksIds);
    });

    it('should notify on success', () => {
      component.cancelTasks(['1', '2']);
      expect(mockNotificationService.success).toHaveBeenCalled();
    });

    it('should notify on error', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error('error')));
      component.cancelTasks(['1', '2']);
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  it('should cancel tasks selection', () => {
    const selection = ['1', '2'];
    component.selection = selection;
    component.onCancelTasksSelection();
    expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith(selection);
  });

  it('should update view in logs', () => {
    mockMatDialog.open.mockReturnValueOnce({
      afterClosed() {
        return of({
          serviceIcon: 'newIcon',
          serviceName: 'newName',
          urlTemplate: 'newUrl',
        });
      }
    });
    component.manageViewInLogs();
    expect(component.serviceIcon).toEqual('newIcon');
    expect(component.serviceName).toEqual('newName');
    expect(component.urlTemplate).toEqual('newUrl');
  });

  describe('addCustomColumn', () => {
    const newCustom: CustomColumn[] = ['options.options.newColumn', 'options.options.FastCompute'];

    beforeEach(() => {
      mockMatDialog.open.mockReturnValueOnce({
        afterClosed() {
          return of(newCustom);
        }
      });
      component.customColumns = customColumns;
      component.displayedColumnsKeys.filter(c => c === 'options.options.FastCompute');
      component.addCustomColumn();
    });

    it('should update custom columns', () => {
      expect(component.customColumns).toEqual(newCustom);
    });

    it('should update available columns', () => {
      expect(component.availableColumns).toEqual([...defaultColumns, ...newCustom]);
    });

    it('should update displayed columns', () => {
      expect(component.displayedColumnsKeys).toEqual([...defaultColumns, 'options.options.newColumn']);
    });

    it('should update line displayed columns', () => {
      expect(component.line.displayedColumns).toEqual([...defaultColumns, 'options.options.newColumn']);
    });

    it('should update line custom columns', () => {
      expect(component.line.customColumns).toEqual(newCustom);
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
      expect(component.line.showFilters).toEqual(newShowFilters);
    });
  });
});