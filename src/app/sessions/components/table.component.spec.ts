import { SessionRaw, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { TaskStatusColored } from '@app/types/dialog';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsTableComponent } from './table.component';
import { SessionsIndexService } from '../services/sessions-index.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRawColumnKey } from '../types';

describe('ApplicationsTableComponent', () => {
  let component: ApplicationsTableComponent;

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

  const displayedColumns: SessionRawColumnKey[] = ['sessionId', 'count', 'actions'];

  
  const sort: MatSort = {
    active: 'sessionId',
    direction: 'asc',
    sortChange: new EventEmitter()
  } as unknown as MatSort;

  const paginator: MatPaginator = {
    pageIndex: 2,
    pageSize: 50,
    page: new EventEmitter()
  } as unknown as MatPaginator;

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => tasksStatusesColored)
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
  };

  const mockNotificationService = {
    success: jest.fn()
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ApplicationsTableComponent,
        {provide: SessionsIndexService, useValue: mockSessionsIndexService},
        {provide: TasksByStatusService, useValue: mockTasksByStatusService},
        IconsService,
        FiltersService,
        {provide: NotificationService, useValue: mockNotificationService},
        SessionsStatusesService
      ]
    }).inject(ApplicationsTableComponent);

    component.sort = sort;
    component.paginator = paginator;

    component.options = {
      pageIndex: 0,
      pageSize: 10,
      sort: {
        active: 'partitionIds',
        direction: 'desc'
      }
    };

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

  it('should update options sort on sort change', () => {
    sort.sortChange.emit();
    expect(component.options.sort).toEqual({
      active: sort.active,
      direction: sort.direction
    });
  });

  it('should update options paginator on page change', () => {
    paginator.page.emit();
    expect(component.options).toEqual({
      pageIndex: paginator.pageIndex,
      pageSize: paginator.pageSize,
      sort: {
        active: 'partitionIds',
        direction: 'desc'
      }
    });
  });

  it('should get related icons', () => {
    expect(component.getIcon('more')).toEqual('more_vert');
  });

  it('should get column label', () => {
    const column: SessionRawColumnKey = 'sessionId';
    component.columnToLabel(column);
    expect(mockSessionsIndexService.columnToLabel).toHaveBeenCalledWith(column);
  });

  it('should check if the column is not sortable', () => {
    const column: SessionRawColumnKey = 'count';
    component.isNotSortableColumn(column);
    expect(mockSessionsIndexService.isNotSortableColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is simple', () => {
    const column: SessionRawColumnKey = 'partitionIds';
    component.isSimpleColumn(column);
    expect(mockSessionsIndexService.isSimpleColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is "session Id"', () => {
    const column: SessionRawColumnKey = 'sessionId';
    component.isSessionIdColumn(column);
    expect(mockSessionsIndexService.isSessionIdColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is an object', () => {
    const column: SessionRawColumnKey = 'options';
    component.isObjectColumn(column);
    expect(mockSessionsIndexService.isObjectColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is a date', () => {
    const column: SessionRawColumnKey = 'cancelledAt';
    component.isDateColumn(column);
    expect(mockSessionsIndexService.isDateColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is a duration', () => {
    const column: SessionRawColumnKey = 'duration';
    component.isDurationColumn(column);
    expect(mockSessionsIndexService.isDurationColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is a status', () => {
    const column: SessionRawColumnKey = 'status';
    component.isStatusColumn(column);
    expect(mockSessionsIndexService.isStatusColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is counting', () => {
    const column: SessionRawColumnKey = 'count';
    component.isCountColumn(column);
    expect(mockSessionsIndexService.isCountColumn).toHaveBeenCalledWith(column);
  });

  it('should check if the column is actions', () => {
    const column: SessionRawColumnKey = 'actions';
    component.isActionsColumn(column);
    expect(mockSessionsIndexService.isActionsColumn).toHaveBeenCalledWith(column);
  });

  it('should change column order', () => {
    const event = {
      previousIndex: 0,
      currentIndex: 1
    } as unknown as CdkDragDrop<string[]>;
    component.onDrop(event);
    expect(mockSessionsIndexService.saveColumns).toHaveBeenCalledWith(component.displayedColumns);
    expect(component.displayedColumns).toEqual(['count', 'sessionId', 'actions']);
  });

  describe('show', () => {
    const element = {
      options: {
        maxDuration: {
          seconds: '93450',
          nanos: 0
        },
      },
      duration: {
        seconds: '83490',
        nanos: 0
      }
    } as unknown as SessionRaw;

    it('should extract from duration column', () => {
      expect(component.extractData(element, 'duration')).toEqual({
        seconds: '83490',
        nanos: 0
      });
    });

    it('should extract data from options duration', () => {
      expect(component.extractData(element, 'options.maxDuration')).toEqual({
        seconds: '93450',
        nanos: 0
      } as unknown as Duration);
    });

    it('should return null if there no options', () => {
      expect(component.extractData({} as unknown as SessionRaw, 'options.maxDuration')).toEqual(null);
    });
  });

  describe('columnToDate', () => {
    it('should turn a column to a date', () => {
      const timestamp = {
        toDate: jest.fn()
      } as unknown as Timestamp;
  
      component.columnToDate(timestamp);
      expect(timestamp.toDate).toHaveBeenCalled();
    });
  
    it('should return null if there is no element', () => {
      expect(component.columnToDate(undefined)).toEqual(null);
    });
  });

  it('should get the label of a session status', () => {
    expect(component.statusToLabel(SessionStatus.SESSION_STATUS_RUNNING)).toEqual('Running');
  });

  it('should notify user on copy', () => {
    component.onCopiedSessionId();
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

  it('should emit on Cancel', () => {
    const spy = jest.spyOn(component.cancelSession, 'emit');
    component.onCancel('sessionId');
    expect(spy).toHaveBeenCalledWith('sessionId');
  });

  it('should show the specified option of a session', () => {
    
  });
});