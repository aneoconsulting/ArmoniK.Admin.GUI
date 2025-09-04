import { SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { GrpcAction } from '@app/types/actions.type';
import { TableColumn } from '@app/types/column.type';
import { ArmonikData, ColumnKey, SessionData } from '@app/types/data';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { of } from 'rxjs';
import { SessionsTableComponent } from './table.component';
import { SessionsDataService } from '../services/sessions-data.service';
import { SessionRaw } from '../types';

function getAction(actions: GrpcAction<SessionRaw>[], label: string) {
  return actions.filter(action => action.label === label)[0];
} 

describe('SessionsTableComponent', () => {
  let component: SessionsTableComponent;

  const displayedColumns: TableColumn<SessionRaw, TaskOptions>[] = [
    {
      name: 'Session ID',
      key: 'sessionId',
      type: 'link',
      sortable: true,
      link: '/sessions',
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: 'Created at',
      key: 'createdAt',
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

  const mockSessionsDataService = {
    data: signal([] as ArmonikData<SessionRaw, TaskOptions>[]),
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const mockTasksByStatusService = {
    restoreStatuses: jest.fn(() => defaultStatusesGroups),
    saveStatuses: jest.fn()
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

  const mockRouter = {
    navigate: jest.fn()
  };

  const cachedSession = { sessions: [{ sessionId: 'session1' }, { sessionId: 'session2' }] as SessionRaw[], total: 2 };
  const mockCacheService = {
    get: jest.fn(() => cachedSession),
    save: jest.fn()
  };

  const mockStatusService = {
    statuses: {
      [SessionStatus.SESSION_STATUS_CANCELLED]: {
        label: 'Cancelled',
      },
      [SessionStatus.SESSION_STATUS_CLOSED]: {
        label: 'Closed'
      },
    },
    canPause: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_PAUSED),
    canResume: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_RUNNING),
    canCancel: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_CANCELLED),
    canPurge: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_RUNNING),
    canClose: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_CLOSED),
    canDelete: jest.fn((s: SessionStatus) => s !== SessionStatus.SESSION_STATUS_DELETED),
  };

  const mockGrpcService = {
    actions: [],
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionsTableComponent,
        { provide: SessionsDataService, useValue: mockSessionsDataService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: StatusService, useValue: mockStatusService },
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService},
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Router, useValue: mockRouter },
        { provide: GrpcActionsService, useValue: mockGrpcService },
      ]
    }).inject(SessionsTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  it('should return columns keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(column => column.key));
  });
  
  it('should emit on options changes', () => {
    const spy = jest.spyOn(component.optionsUpdate, 'emit');
    component.onOptionsChange();
    expect(spy).toHaveBeenCalled();
  });

  it('should emit on column drop', () => {
    const newColumns: ColumnKey<SessionRaw, TaskOptions>[] = ['actions', 'sessionId', 'status'];
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  it('should send a notification on copy', () => {
    component.onCopiedSessionId({
      sessionId: 'sessionId'
    } as unknown as SessionRaw);
    expect(mockClipBoard.copy).toHaveBeenCalledWith('sessionId');
    expect(mockNotificationService.success).toHaveBeenCalledWith('Session ID copied to clipboard');
  });

  describe('personnalizeTasksByStatus', () => {
    beforeEach(() => {
      component.personalizeTasksByStatus();
    });

    it('should update statusesGroups', () => {
      expect(component.statusesGroups).toEqual([...mockDialogReturn.groups]);
    });

    it('should call tasksByStatus service',() => {
      expect(mockTasksByStatusService.saveStatuses).toHaveBeenCalledWith(component.table, component.statusesGroups);
    });
  });

  describe('actions', () => {
    const session = {
      sessionId: 'sessionId',
      status: SessionStatus.SESSION_STATUS_RUNNING
    } as SessionRaw;

    it('should copy', () => {
      const spy = jest.spyOn(component, 'onCopiedSessionId');
      const action = getAction(component.actions, 'Copy session ID');
      action.click([session]);
      expect(spy).toHaveBeenCalledWith(session);
    });

    it('should permit to see session', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      const action = getAction(component.actions, 'See session');
      action.click([session]);
      expect(spy).toHaveBeenCalledWith(['/sessions', session.sessionId]);
    });

    it('should permit to see results', () => {
      const mockSession = {
        raw: {
          sessionId: 'sessionId',
        },
        resultsQueryParams: {
          '0-root-1-0': 'sessionId'
        }
      } as unknown as SessionData;
      mockSessionsDataService.data.set([mockSession]);
      const spy = jest.spyOn(component.router, 'navigate');
      const action = getAction(component.actions, 'See results');
      action.click([session]);
      expect(spy).toHaveBeenCalledWith(['/results'], { queryParams: mockSession.resultsQueryParams });
    });
  });

  describe('isDataRawEqual', () => {
    it('should return true if two sessionRaws are the same', () => {
      const session1 = { sessionId: 'session' } as SessionRaw;
      const session2 = {...session1} as SessionRaw;
      expect(component.isDataRawEqual(session1, session2)).toBeTruthy();
    });

    it('should return false if two sessionRaws are differents', () => {
      const session1 = { sessionId: 'session' } as SessionRaw;
      const session2 = { sessionId: 'session1' } as SessionRaw;
      expect(component.isDataRawEqual(session1, session2)).toBeFalsy();
    });
  });

  it('should track a session by its id', () => {
    const session = {raw: { sessionId: 'session' }} as SessionData;
    expect(component.trackBy(0, session)).toEqual(session.raw.sessionId);
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockSessionsDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockSessionsDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockSessionsDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockSessionsDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map(c => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.columns).toEqual(displayedColumns);
  });
});