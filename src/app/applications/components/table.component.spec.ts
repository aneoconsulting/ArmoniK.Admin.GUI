import { ApplicationRawEnumField, FilterStringOperator, TaskOptionEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsTableComponent } from './table.component';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilters } from '../types';

describe('TasksTableComponent', () => {
  let component: ApplicationsTableComponent;

  const displayedColumns: TableColumn<ApplicationRawColumnKey>[] = [
    {
      name: 'Namespace',
      key: 'namespace',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: 'Namespace',
      key: 'name',
      type: 'status',
      sortable: true,
    },
    {
      name: 'version',
      key: 'version',
      type: 'date',
      sortable: true,
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false,
    }
  ];

  const mockApplicationsIndexService = {
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

  const mockApplicationsGrpcService = {
    list$: jest.fn(() => of({ applications: [{ name: 'application1', version: 'version1' }, { name: 'application2', version: 'version2' }, { name: 'application3', version: 'version3' }], total: 3 })),
    cancel$: jest.fn(() => of({})),
  };

  const matDialogData: TaskStatusColored[] = [
    {
      color: 'red',
      status: TaskStatus.TASK_STATUS_CANCELLING,
    },
    {
      color: 'blue',
      status: TaskStatus.TASK_STATUS_CREATING,
    },
    {
      color: 'green',
      status: TaskStatus.TASK_STATUS_RETRIED
    }
  ];
  const mockMatDialog = {
    open: jest.fn(() => {
      return {
        afterClosed: jest.fn(() => of(matDialogData))
      };
    })
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(),
    saveStatuses: jest.fn()
  };

  const mockRouter = {
    navigate: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        { provide: ApplicationsIndexService, useValue: mockApplicationsIndexService },
        { provide: ApplicationsGrpcService, useValue: mockApplicationsGrpcService },
        FiltersService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        IconsService,
        { provide: Router, useValue: mockRouter }
      ]
    }).inject(ApplicationsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<ApplicationRawFilters>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
        direction: 'desc'
      }
    };
    component.refresh$ = new Subject();
    component.loading$ = new Subject();
    component.ngOnInit();
    component.ngAfterViewInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data).toEqual<ApplicationData[]>([
      {
        raw: {
          name: 'application1',
          version: 'version1'
        } as ApplicationRaw,
        queryTasksParams: {
          '0-options-5-0': 'application1',
          '0-options-6-0': 'version1'
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application1' },
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version1' }
        ]],
        value$: expect.any(Subject)
      },
      {
        raw: {
          name: 'application2',
          version: 'version2'
        } as ApplicationRaw,
        queryTasksParams: {
          '0-options-5-0': 'application2',
          '0-options-6-0': 'version2'
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application2' },
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version2' }
        ]],
        value$: expect.any(Subject)
      },
      {
        raw: {
          name: 'application3',
          version: 'version3'
        } as ApplicationRaw,
        queryTasksParams: {
          '0-options-5-0': 'application3',
          '0-options-6-0': 'version3'
        },
        filters: [[
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'application3' },
          { for: 'options', field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION, operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, value: 'version3' }
        ]],
        value$: expect.any(Subject)
      }
    ]);
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockApplicationsGrpcService.list$.mockImplementationOnce(() => {
        return throwError(() => new Error());
      });
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
      expect(component.data).toEqual([]);
    });
  });

  it('should refresh data on options changes', () => {
    const spy = jest.spyOn(component.refresh$, 'next');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  test('onDrop should call ApplicationsIndexService', () => {
    const newColumns: ApplicationRawColumnKey[] = ['actions', 'name', 'namespace', 'version'];
    component.onDrop(newColumns);
    expect(mockApplicationsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update tasks statuses', () => {
      expect(component.tasksStatusesColored).toEqual(matDialogData);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, matDialogData);
    });
  });

  it('should create params for a session redirection', () => {
    const data = {
      name: 'name',
      version: 'version'
    };
    expect(component.createViewSessionsQueryParams(data.name, data.version)).toEqual({
      '0-options-5-0': data.name,
      '0-options-6-0': data.version
    });
  });

  describe('createTasksByStatysQueryParams', () => {
    it('should create params for a task by status redirection', () => {
      const data = {
        name: 'name',
        version: 'version'
      };
      expect(component.createTasksByStatusQueryParams(data.name, data.version)).toEqual({
        '0-options-5-0': data.name,
        '0-options-6-0': data.version
      });
    });

    it('should create params for each filter', () => {
      component.filters = [
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_NOT_EQUAL,
            for: 'root',
            value: 'name'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            for: 'root',
            value: 'service'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            for: 'root',
            value: 'shouldNotAppearNamespace',
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED,
            operator: null,
            for: 'root',
            value: null
          }
        ],
        [
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_ENDS_WITH,
            for: 'root',
            value: 'shouldNotAppear'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_CONTAINS,
            for: 'root',
            value: 'version'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_STARTS_WITH,
            for: 'root',
            value: 'namespace',
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            for: 'root',
            value: 'shouldNotAppearName'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
            operator: null,
            for: 'root',
            value: 'shouldNotAppearService'
          },
          {
            field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            for: 'root',
            value: null,
          }
        ]
      ];
      const data = {
        name: 'nameData',
        version: 'versionData'
      };
      expect(component.createTasksByStatusQueryParams(data.name, data.version)).toEqual({
        '0-options-5-1': 'name',
        '0-options-8-0': 'service',
        '0-options-5-0': data.name,
        '0-options-6-0': data.version,
        '1-options-6-2': 'version',
        '1-options-7-4': 'namespace',
        '1-options-5-0': data.name,
        '1-options-6-0': data.version,
      });
    });
  });

  it('should get page icon', () => {
    expect(component.getPageIcon('applications')).toEqual('apps');
  });

  describe('actions', () => {
    it('should redirect to sessions', () => {
      const data = {
        name: 'name',
        version: 'version'
      };
      component.actions[0].action$.next({raw: data} as ApplicationData);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions'], { queryParams: component.createViewSessionsQueryParams(data.name, data.version) });
    });
  });
});