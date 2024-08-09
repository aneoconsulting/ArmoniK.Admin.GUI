import { ApplicationRawEnumField, FilterStringOperator, TaskOptionEnumField, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, of, throwError } from 'rxjs';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TableColumn } from '@app/types/column.type';
import { ApplicationData, ColumnKey } from '@app/types/data';
import { FiltersOr } from '@app/types/filters';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsTableComponent } from './table.component';
import { ApplicationsGrpcService } from '../services/applications-grpc.service';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRaw } from '../types';

describe('TasksTableComponent', () => {
  let component: ApplicationsTableComponent;

  const displayedColumns: TableColumn<ApplicationRaw>[] = [
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
    saveColumns: jest.fn(),
    saveOptions: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const applications = { applications: [{ name: 'application1', version: 'version1' }, { name: 'application2', version: 'version2' }, { name: 'application3', version: 'version3' }], total: 3 };
  const mockApplicationsGrpcService = {
    list$: jest.fn(() => of(applications)),
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

  const mockRouter = {
    navigate: jest.fn()
  };

  const cachedApplications = { applications: [{ name: 'application1', version: 'version1' }, { name: 'application2', version: 'version2' }], total: 2 };
  const mockCacheService = {
    get: jest.fn(() => cachedApplications),
    save: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        { provide: ApplicationsIndexService, useValue: mockApplicationsIndexService },
        { provide: ApplicationsGrpcService, useValue: mockApplicationsGrpcService },
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        IconsService,
        { provide: Router, useValue: mockRouter }
      ]
    }).inject(ApplicationsTableComponent);

    component.displayedColumns = displayedColumns;
    component.filters$ = new BehaviorSubject<FiltersOr<ApplicationRawEnumField>>([]);
    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'name',
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
    it('should get cached data', () => {
      expect(mockCacheService.get).toHaveBeenCalled();
    });
  });

  describe('loadFromCache', () => {
    beforeEach(() => {
      component.loadFromCache();
    });

    it('should update total data with cached one', () => {
      expect(component.total).toEqual(cachedApplications.total);
    });
    
    it('should update data with cached one', () => {
      expect(component.data()).toEqual([
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
          ]]
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
          ]]
        }
      ]);
    });
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data()).toEqual<ApplicationData[]>([
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
        ]]
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
        ]]
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
        ]]
      }
    ]);
  });

  it('should cache the received data', () => {
    component.refresh$.next();
    expect(mockCacheService.save).toHaveBeenCalled();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });

  describe('on list error', () => {
    beforeEach(() => {
      mockApplicationsGrpcService.list$.mockReturnValueOnce(throwError(() => new Error()));
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

  describe('options changes', () => {
    it('should refresh data', () => {
      const spy = jest.spyOn(component.refresh$, 'next');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });

    it('should save options', () => {
      component.onOptionsChange();
      expect(mockApplicationsIndexService.saveOptions).toHaveBeenCalled();
    });
  });

  test('onDrop should call ApplicationsIndexService', () => {
    const newColumns: ColumnKey<ApplicationRaw>[] = ['actions', 'name', 'namespace', 'version'];
    component.onDrop(newColumns);
    expect(mockApplicationsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroup', () => {
      expect(component.statusesGroups).toEqual(mockDialogReturn.groups);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
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
    expect(component.getIcon('applications')).toEqual('apps');
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

  describe('isDataRawEqual', () => {
    it('should return true if two ApplicationRaws are the same', () => {
      const application1 = { name: 'application', version: '0.1.2' } as ApplicationRaw;
      const application2 = {...application1} as ApplicationRaw;
      expect(component.isDataRawEqual(application1, application2)).toBeTruthy();
    });

    it('should return false if two ApplicationRaws are differents', () => {
      const application1 = { name: 'application', version: '0.1.2'} as ApplicationRaw;
      const application2 = { name: 'application', version: '0.1.3'} as ApplicationRaw;
      expect(component.isDataRawEqual(application1, application2)).toBeFalsy();
    });
  });

  it('should track an application by its name and version', () => {
    const application = {raw: { name: 'application', version: '0.1.2'}} as ApplicationData;
    expect(component.trackBy(0, application)).toEqual(`${application.raw.name}-${application.raw.version}`);
  });
});