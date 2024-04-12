import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { TableColumn } from '@app/types/column.type';
import { SessionData } from '@app/types/data';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { SessionsTableComponent } from './table.component';
import { SessionsGrpcService } from '../services/sessions-grpc.service';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRawColumnKey, SessionRawFilters } from '../types';

describe('SessionsTableComponent', () => {
  let component: SessionsTableComponent;

  const tasksStatusesColored: TaskStatusColored[] = [
    {
      color: 'red',
      status: TaskStatus.TASK_STATUS_ERROR
    },
    {
      color: 'yellow',
      status: TaskStatus.TASK_STATUS_CREATING
    },
    {
      color: 'green',
      status: TaskStatus.TASK_STATUS_COMPLETED
    }
  ];

  const displayedColumns: TableColumn<SessionRawColumnKey>[] = [
    {
      name: 'Count',
      key: 'count',
      type: 'count',
      sortable: true
    },
    {
      name: 'Session ID',
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false
    }
  ];

  const filters: SessionRawFilters = [
    [
      {
        field: 1,
        for: 'root',
        operator: 1,
        value: 'session not equal'
      },
      {
        field: 2,
        for: 'root',
        operator: 0,
        value: 'not appearing in creatingTaskStatusFilter'
      },
      {
        field: 1,
        for: 'root',
        operator: 0,
        value: 'session equal' // should not appear in creatingTaskStatusFilter
      }
    ],
    [
      {
        field: 1,
        for: 'root',
        operator: 3,
        value: 'some value'
      },
      {
        field: 1,
        for: 'root',
        operator: 0,
        value: 'not taskStatus'
      },
      {
        field: 5,
        for: 'options',
        operator: 0,
        value: 'application name'
      }
    ]
  ];


  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => tasksStatusesColored),
    saveStatuses: jest.fn(),
  };

  const mockSessionsIndexService = {
    columnToLabel: jest.fn(),
    isNotSortableColumn: jest.fn(),
    isSimpleColumn: jest.fn(),
    isSessionIdColumn: jest.fn(),
    isObjectColumn: jest.fn(),
    isDateColumn: jest.fn(),
    isDurationColumn: jest.fn(),
    isStatusColumn: jest.fn(),
    isCountColumn: jest.fn(),
    isActionsColumn: jest.fn(),
    saveColumns: jest.fn(),
    saveOptions: jest.fn(),
  };

  const mockNotificationService = {
    success: jest.fn()
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const dialogResult = 'color';
  const mockMatDialog = {
    open: () => {
      return {
        afterClosed() {
          return of(dialogResult);
        }
      };
    }
  };

  const mockSessionsGrpcService = {
    list$: jest.fn(() => of({ sessions: [{ sessionId: '1' }, { sessionId: '2' }], total: 2 })),
    delete$: jest.fn(() => of({})),
    close$: jest.fn(() => of({})),
    cancel$: jest.fn(() => of({})),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionsTableComponent,
        { provide: SessionsIndexService, useValue: mockSessionsIndexService },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService },
        IconsService,
        FiltersService,
        { provide: NotificationService, useValue: mockNotificationService },
        SessionsStatusesService,
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: SessionsGrpcService, useValue: mockSessionsGrpcService }
      ]
    }).inject(SessionsTableComponent);

    component.refresh$ = new Subject();
    component.loading$ = new Subject();

    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'partitionIds',
        direction: 'desc'
      }
    };
    component.filters$ = new BehaviorSubject<SessionRawFilters>([]);

    component.ngOnInit();
    component.ngAfterViewInit();

    component.displayedColumns = displayedColumns;
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    expect(component.tasksStatusesColored).toBe(tasksStatusesColored);
  });

  it('should update data on refresh', () => {
    component.refresh$.next();
    expect(component.data).toEqual([
      {
        raw: {
          sessionId: '1'
        },
        queryParams: new Map().set('sessionId', { '0-root-1-0': '1' }),
        resultsQueryParams: { '0-root-1-0': '1' },
        queryTasksParams: { '0-root-1-0': '1' },
        filters: [
          [
            {
              for: 'root',
              field: 1,
              value: '1',
              operator: 0
            }
          ]
        ],
        value$: expect.any(Subject)
      },
      {
        raw: {
          sessionId: '2'
        },
        value$: expect.any(Subject),
        queryParams: new Map().set('sessionId', { '0-root-1-0': '2' }),
        resultsQueryParams: { '0-root-1-0': '2' },
        queryTasksParams: { '0-root-1-0': '2' },
        filters: [
          [
            {
              for: 'root',
              field: 1,
              value: '2',
              operator: 0
            }
          ]
        ]
      }
    ]);
  });

  it('should get related icons', () => {
    expect(component.getIcon('more')).toEqual('more_vert');
  });

  it('should change column order', () => {
    const newColumns: SessionRawColumnKey[] = ['actions', 'sessionId', 'count'];
    component.onDrop(newColumns);
    expect(mockSessionsIndexService.saveColumns).toHaveBeenCalledWith(newColumns);
    expect(component.displayedColumns).toEqual(displayedColumns);
  });

  describe('createTasksByStatusQueryParams', () => {

    const sessionId = 'Session 1';

    it('should create query params for the specified application', () => {
      expect(component.createTasksByStatusQueryParams(sessionId)).toEqual({
        '0-root-1-0': sessionId,
      });
    });

    it('should create query params for the specified application and applied filters', () => {
      component.filters = filters;
      expect(component.createTasksByStatusQueryParams(sessionId)).toEqual({
        '0-root-1-0': sessionId,
        '0-root-1-1': 'session not equal',
        '1-root-1-0': sessionId,
        '1-root-1-3': 'some value',
        '1-options-5-0': 'application name',
      });
    });
  });

  it('should notify user on copy', () => {
    component.onCopiedSessionId({
      raw: {
        sessionId: 'session-id-1'
      }
    } as unknown as SessionData);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('session-id-1');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Session ID copied to clipboard');
  });

  it('should create sessionId params for task page', () => {
    expect(component.createSessionIdQueryParams('session-Id-1')).toEqual({
      '1-root-1-0': 'session-Id-1'
    });
  });

  it('should get countTasksByStatysFilters', () => {
    expect(component.countTasksByStatusFilters('session-id-1')).toEqual([[
      {
        for: 'root',
        field: 1,
        value: 'session-id-1',
        operator: 0
      }
    ]]);
  });

  it('should ask grpc service to cancel session on Cancel', () => {
    component.onCancel('sessionId');
    expect(mockSessionsGrpcService.cancel$).toHaveBeenCalledWith('sessionId');
  });

  it('should personalize tasks by status', () => {
    component.personalizeTasksByStatus();
    expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith('sessions', dialogResult);
  });

  describe('on delete', () => {
    it('should ask grpc service to delete session', () => {
      component.onDelete('2');
      expect(mockSessionsGrpcService.delete$).toHaveBeenCalledWith('2');
    });
  });

  describe('on close', () => {
    it('should ask grpc service to close session', () => {
      component.onClose('2');
      expect(mockSessionsGrpcService.close$).toHaveBeenCalledWith('2');
    });
  });
});