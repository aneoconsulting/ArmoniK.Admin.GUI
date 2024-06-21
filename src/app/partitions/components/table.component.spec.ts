import { FilterNumberOperator, FilterStringOperator, PartitionRawEnumField, TaskOptionEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TableColumn } from '@app/types/column.type';
import { PartitionData } from '@app/types/data';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsTableComponent } from './table.component';
import { PartitionsGrpcService } from '../services/partitions-grpc.service';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters } from '../types';

describe('TasksTableComponent', () => {
  let component: PartitionsTableComponent;

  const displayedColumns: TableColumn<PartitionRawColumnKey>[] = [
    {
      name: 'Count',
      key: 'count',
      type: 'count',
      sortable: true
    },
    {
      name: 'Pod Reserved',
      key: 'podReserved',
      type: 'link',
      sortable: true,
      link: '/partitions',
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

  const mockPartitionsIndexService = {
    isActionsColumn: jest.fn(),
    isTaskIdColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isDurationColumn: jest.fn(),
    isObjectColumn: jest.fn(),
    isSelectColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isNotSortableColumn: jest.fn(),
    columnToLabel: jest.fn(),
    saveColumns: jest.fn()
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const partitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }, { id: 'partition3', }], total: 3 };
  const mockPartitionsGrpcService = {
    list$: jest.fn(() => of(partitions)),
    cancel$: jest.fn(() => of({})),
  };

  const defaultStatusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR],
      color: '#ff0000',
    },
  ];

  const mockDialogReturn: ManageGroupsDialogResult = {
    groups: [
      {
        name: 'Timeout',
        statuses: [TaskStatus.TASK_STATUS_TIMEOUT],
        color: '#ff6944',
      },
      {
        name: 'Retried',
        statuses: [TaskStatus.TASK_STATUS_RETRIED],
        color: '#ff9800',
      }
    ]
  };

  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(mockDialogReturn))
      };
    })
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => defaultStatusesGroups),
    saveStatuses: jest.fn()
  };

  const cachedPartitions = { partitions: [{ id: 'partition1' }, { id: 'partition2', }], total: 2 };
  const mockCacheService = {
    get: jest.fn(() => cachedPartitions),
    save: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        PartitionsTableComponent,
        { provide: PartitionsIndexService, useValue: mockPartitionsIndexService },
        { provide: PartitionsGrpcService, useValue: mockPartitionsGrpcService },
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
      ]
    }).inject(PartitionsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<PartitionRawFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'id',
        direction: 'desc'
      }
    };
    component.refresh$ = new Subject();
    component.loading = signal(false);
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should load cached data from cachedService', () => {
      expect(mockCacheService.get).toHaveBeenCalled();
    });
  });

  describe('loadFromCache', () => {
    beforeEach(() => {
      component.loadFromCache();
    });

    it('should update total data with cached one', () => {
      expect(component.total).toEqual(cachedPartitions.total);
    });

    it('should update data with cached one', () => {
      expect(component.data()).toEqual([
        {
          raw: {
            id: 'partition1',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition1',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
          ]],
          value$: expect.any(Subject)
        },
        {
          raw: {
            id: 'partition2',
          } as PartitionRaw,
          queryTasksParams: {
            '0-options-4-0': 'partition2',
          },
          filters: [[
            { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
          ]],
          value$: expect.any(Subject)
        },
      ]);
    });
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data()).toEqual<PartitionData[]>([
      {
        raw: {
          id: 'partition1',
        } as PartitionRaw,
        queryTasksParams: {
          '0-options-4-0': 'partition1',
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition1' },
        ]],
        value$: expect.any(Subject)
      },
      {
        raw: {
          id: 'partition2',
        } as PartitionRaw,
        queryTasksParams: {
          '0-options-4-0': 'partition2',
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition2' },
        ]],
        value$: expect.any(Subject)
      },
      {
        raw: {
          id: 'partition3',
        } as PartitionRaw,
        queryTasksParams: {
          '0-options-4-0': 'partition3',
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'partition3' },
        ]],
        value$: expect.any(Subject)
      }
    ]);
  });

  it('should cache received data', () => {
    component.refresh$.next();
    expect(mockCacheService.get).toHaveBeenCalled();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockPartitionsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
    });

    it('should log error', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => { });
      component.refresh$.next();
      expect(spy).toHaveBeenCalled();
    });

    it('should send a notification', () => {
      component.refresh$.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should send empty data', () => {
      component.refresh$.next();
      expect(component.data()).toEqual([]);
    });
  });

  it('should refresh data on options changes', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  test('onDrop should call PartitionsIndexService', () => {
    const newColumns: PartitionRawColumnKey[] = ['actions', 'id', 'parentPartitionIds', 'preemptionPercentage'];
    component.onDrop(newColumns);
    expect(mockPartitionsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroups', () => {
      expect(component.statusesGroups).toEqual(mockDialogReturn.groups);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
    });
  });

  describe('createTasksByStatysQueryParams', () => {
    it('should create params for a task by status redirection', () => {
      const partitionId = 'partitionId';
      expect(component.createTasksByStatusQueryParams(partitionId)).toEqual({
        '0-options-4-0': partitionId,
      });
    });

    it('should create params for each filter', () => {
      component.filters = [
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
            value: 'partitionId',
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: '1',
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            operator: null,
            value: null,
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: null,
            for: 'root'
          }
        ],
        [
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: 'ShouldNotAppearId',
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            value: '2',
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
            operator: null,
            value: 'nullOperatorPartionId',
            for: 'root'
          },
          {
            field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN,
            value: '3',
            for: 'root'
          }
        ]
      ];
      const partitionId = 'partitionId';
      expect(component.createTasksByStatusQueryParams(partitionId)).toEqual({
        '0-options-4-1': 'partitionId',
        '0-options-3-0': '1',
        '0-options-4-0': partitionId,
        '1-options-3-2': '2',
        '1-options-4-0': partitionId,
      });
    });
  });
});