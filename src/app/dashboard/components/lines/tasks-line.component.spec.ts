import { FilterStringOperator, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ViewContainerRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import TasksDataService from '@app/tasks/services/tasks-data.service';
import { TasksIndexService } from '@app/tasks/services/tasks-index.service';
import { TaskOptions, TaskSummary } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, CustomColumn } from '@app/types/data';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '@app/types/filters';
import { GroupConditions } from '@app/types/groups';
import { ListOptions } from '@app/types/options';
import { AutoRefreshService } from '@services/auto-refresh.service';
import { DefaultConfigService } from '@services/default-config.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { of } from 'rxjs';
import { TasksLineComponent } from './tasks-line.component';
import { TableLine } from '../../types';

describe('TasksLineComponent', () => {
  let component: TasksLineComponent;

  const defaultConfigService = new DefaultConfigService();

  const defaultColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'options.applicationName', 'actions', 'status', 'select'];
  const customColumns: CustomColumn[] = ['options.options.FastCompute'];

  const displayedColumns: TableColumn<TaskSummary, TaskOptions>[] = [
    {
      key: 'id',
      name: 'ID',
      type: 'link',
      link: '/tasks/',
      sortable: true
    },
    {
      key: 'options.applicationName',
      name: 'Task Name',
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
    },
    {
      name: $localize`Select`,
      key: 'select',
      type: 'select',
      sortable: false,
    },
  ];

  const options: ListOptions<TaskSummary, TaskOptions> = {
    pageIndex: 0,
    pageSize: 5,
    sort: {
      active: 'id',
      direction: 'desc',
    },
  };

  const lineGroup: GroupConditions<TaskSummaryEnumField, TaskOptionEnumField> = {
    name: 'Group 1',
    conditions: [[{
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      for: 'root',
      operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
      value: 'name'
    }]],
  };

  const line: TableLine<TaskSummary, TaskOptions> = {
    name: 'Tasks',
    type: 'Tasks',
    displayedColumns: [...displayedColumns.map(c => c.key), ...customColumns],
    filters: [],
    interval: 20,
    options: options,
    showFilters: false,
    groups: lineGroup as unknown as GroupConditions<FiltersEnums, FiltersOptionsEnums>[],
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

  const mockTasksDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [] as FiltersOr<TaskSummaryEnumField>,
    refresh$: {
      next: jest.fn()
    },
    cancelTasks: jest.fn(),
    initGroups: jest.fn(),
    manageGroupDialogResult: jest.fn(),
    groupsConditions: [],
    groups: [],
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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        TasksLineComponent,
        { provide: MatDialog, useValue: mockMatDialog },
        AutoRefreshService,
        IconsService,
        { provide: TasksDataService, useValue: mockTasksDataService },
        { provide: TasksIndexService, useValue: mockTasksIndexService },
        DefaultConfigService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ViewContainerRef, usevalue: {} },
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

  it('should load properly', () => {
    expect(component.loading).toEqual(mockTasksDataService.loading);
  });

  describe('on init', () => {
    it('should init with line values', () => {
      const intervalSpy = jest.spyOn(component.interval, 'next');
      component.ngOnInit();
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

    it('should init groups', () => {
      expect(mockTasksDataService.groupsConditions).toBe(lineGroup);
      expect(mockTasksDataService.initGroups).toHaveBeenCalled();
    });
  });

  it('should unsubscribe on destroy', () => {
    const subSpy = jest.spyOn(component.subscriptions, 'unsubscribe');
    component.ngOnDestroy();
    expect(subSpy).toHaveBeenCalled();
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

  it('should get icon', () => {
    expect(component.getIcon('tune')).toEqual('tune');
  });

  it('should generate an autoRefresh tooltip', () => {
    expect(component.autoRefreshTooltip()).toEqual(`Auto-refresh every ${line.interval} seconds`);
  });

  it('should refresh', () => {
    component.refresh();
    expect(mockTasksDataService.refresh$.next).toHaveBeenCalled();
  });

  describe('On Options Change', () => {
    beforeEach(() => {
      component.onOptionsChange();
    });

    it('should save options', () => {
      expect(component.line.options).toEqual(mockTasksDataService.options);
    });

    it('should refresh', () => {
      expect(mockTasksDataService.refresh$.next).toHaveBeenCalled();
    });
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
    const newFilters: FiltersOr<TaskSummaryEnumField, TaskOptionEnumField> = [[{for: 'root', field: 0, operator: 1, value: 2}]];

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
      component.onFiltersReset();
      expect(mockTasksDataService.refresh$.next).toHaveBeenCalled();
    });
  });

  describe('OnColumnsChange', () => {
    const newColumns: ColumnKey<TaskSummary, TaskOptions>[] = ['id', 'acquiredAt', 'creationToEndDuration', 'select'];

    beforeEach(() => {
      component.displayedColumnsKeys = ['count', 'id'] as ColumnKey<TaskSummary, TaskOptions>[];
      component.line.displayedColumns = ['id', 'podReserved'] as ColumnKey<TaskSummary, TaskOptions>[];
    });

    it('should change displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.displayedColumnsKeys).toEqual(['select', 'id', 'acquiredAt', 'creationToEndDuration']);
    });

    it('should change line displayedColumns', () => {
      component.onColumnsChange(newColumns);
      expect(component.line.displayedColumns).toEqual(['select', 'id', 'acquiredAt', 'creationToEndDuration']);
    });

    it('should emit', () => {
      const spy = jest.spyOn(component.lineChange, 'emit');
      component.onColumnsChange(['select', 'id', 'acquiredAt', 'creationToEndDuration']);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('onColumnsReset', () => {
    beforeEach(() => {
      component.displayedColumnsKeys = ['preemptionPercentage', 'id'] as ColumnKey<TaskSummary, TaskOptions>[];
      component.line.displayedColumns = ['count', 'actions'] as ColumnKey<TaskSummary, TaskOptions>[];
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
      mockTasksDataService.filters = [[{ field: 1, for: 'root', operator: 1, value: 2 }]];
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
      component.onFiltersReset();
      expect(mockTasksDataService.refresh$.next).toHaveBeenCalled();
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

  it('should cancel task', () => {
    const tasksIds = ['1', '2'];
    component.cancelTasks(tasksIds);
    expect(mockTasksDataService.cancelTasks).toHaveBeenCalledWith(tasksIds);
  });

  it('should cancel selected tasks', () => {
    const selection = ['1', '2'];
    component.selection = selection;
    component.onCancelTasksSelection();
    expect(mockTasksDataService.cancelTasks).toHaveBeenCalledWith(selection);
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
    const newCustom: CustomColumn[] = ['options.options.newColumn'];

    beforeEach(() => {
      mockMatDialog.open.mockReturnValueOnce({
        afterClosed() {
          return of(newCustom);
        }
      });
      component.customColumns = customColumns;
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

  describe('openGroupsSettings', () => {
    const dialogResult = [{fake: 'return'}];
    beforeEach(() => {
      mockMatDialog.open.mockReturnValueOnce({
        afterClosed: () => of(dialogResult)
      });
      component.openGroupsSettings();
    });

    it('should manage the group dialogResult', () => {
      expect(mockTasksDataService.manageGroupDialogResult).toHaveBeenCalledWith(dialogResult);
    });

    it('should save the groups', () => {
      expect(component.line.groups).toEqual(mockTasksDataService.groupsConditions);
    });
  });
});