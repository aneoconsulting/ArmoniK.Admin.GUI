import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsTableComponent } from './table.component';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawFilters } from '../types';

describe('ApplicationTableComponent', () => {
  let component: ApplicationsTableComponent;

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
    restoreOptions: jest.fn(),
    restoreIntervalValue: jest.fn(),
    saveIntervalValue: jest.fn(),
    saveOptions: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn()
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  const mockNotificationService = {
    error: jest.fn()
  };

  const mockApplicationGrpcService = {
    list$: jest.fn(() => of({ applications: [{ name: '1', version: '1' }, { name: '2', version: '1' }], total: 2}))
  };

  let dialogSubject: BehaviorSubject<TaskStatusColored[] | undefined>;

  const filters: ApplicationRawFilters = [
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
        operator: 2,
        value: 'string'
      },
      {
        field: 1,
        for: 'root',
        operator: 0, // This shouldn't appear as a filter when redirecting on a task since it is the application name
        value: 2
      },
    ],
    [
      {
        field: 4,
        for: 'root',
        operator: 3,
        value: 'someValue'
      },
      {
        field: 3,
        for: 'root',
        operator: 2,
        value: 'namespace'
      }
    ]
  ];

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        { provide: ApplicationsIndexService, useValue: mockApplicationIndexService },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        { provide: MatDialog, useValue:
          {
            open: () => {
              return {
                afterClosed: () => {
                  return dialogSubject;
                }
              };
            }
          }
        },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ApplicationsGrpcService, useValue: mockApplicationGrpcService },
        FiltersService,
        IconsService
      ]
    }).inject(ApplicationsTableComponent);
    component.refresh$ = new Subject();
    component.loading$ = new Subject();
    component.displayedColumns = displayedColumns;
    component.filters = [];
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'desc'
      }
    };
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on next', () => {
    component.refresh$.next();
    expect(component.data).toEqual([
      {
        raw: { name: '1', version: '1'},
        queryTasksParams: {
          '0-options-5-0': '1',
          '0-options-6-0': '1'
        },
        filters: [[{
          field: 5,
          for: 'options',
          operator: 0,
          value: '1'
        },
        {
          field: 6,
          for: 'options',
          operator: 0,
          value: '1'
        }]],
        value$: expect.any(Subject)
      },
      {
        raw: { name: '2', version: '1'},
        queryTasksParams: {
          '0-options-5-0': '2',
          '0-options-6-0': '1'
        },
        filters: [[{
          field: 5,
          for: 'options',
          operator: 0,
          value: '2'
        },
        {
          field: 6,
          for: 'options',
          operator: 0,
          value: '1'
        }]],
        value$: expect.any(Subject)
      }
    ]);
  });

  it('should restore taskStatus on init', () => {
    expect(mockTasksByStatusService.restoreStatuses).toHaveBeenCalledWith('applications');
  });

  it('should change column order', () => {
    const newColumns: ApplicationRawColumnKey[] = ['actions', 'count', 'name'];
    component.onDrop(newColumns);
    expect(mockApplicationIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  it('should count tasks by status of the filters', () => {
    expect(component.countTasksByStatusFilters('unified_api', '1.0.0'))
      .toEqual([[
        {
          for: 'options',
          field: 5,
          value: 'unified_api',
          operator: 0
        },
        {
          for: 'options',
          field: 6,
          value: '1.0.0',
          operator: 0
        }
      ]]);
  });

  describe('createTasksByStatusQueryParams', () => {

    const name = 'Application 1';
    const version = '1.0.0';

    it('should create query params for the specified application', () => {
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version
      });
    });

    it('should create query params for the specified application and applied filters', () => {
      component.filters = filters;
      expect(component.createTasksByStatusQueryParams(name, version)).toEqual({
        '0-options-5-0': name,
        '0-options-6-0': version,
        '0-options-5-1': '2',
        '0-options-6-2': 'string',
        '1-options-5-0': name,
        '1-options-6-0': version,
        '1-options-8-3': 'someValue',
        '1-options-7-2': 'namespace'
      });
    });
  });

  it('should create the query params to view sessions', () => {
    expect(component.createViewSessionsQueryParams('name', 'version'))
      .toEqual({
        ['0-options-5-0']: 'name',
        ['0-options-6-0']: 'version'
      });
  });

  it('should permit to personalize tasks by status', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    component.personalizeTasksByStatus();
    expect(component.tasksStatusesColored).toEqual([{
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }]);
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalled();
  });

  it('should not personalize if there is no result', () => {
    dialogSubject = new BehaviorSubject<TaskStatusColored[] | undefined>(undefined);
    component.personalizeTasksByStatus();
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledTimes(0);
  });
});