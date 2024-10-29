import { SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ManageGroupsDialogResult, TasksStatusesGroup } from '@app/dashboard/types';
import { TaskOptions } from '@app/tasks/types';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, SessionData } from '@app/types/data';
import { ActionTable } from '@app/types/table';
import { CacheService } from '@services/cache.service';
import { FiltersService } from '@services/filters.service';
import { NotificationService } from '@services/notification.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { of } from 'rxjs';
import { SessionsTableComponent } from './table.component';
import { SessionsDataService } from '../services/sessions-data.service';
import { SessionsStatusesService } from '../services/sessions-statuses.service';
import { SessionRaw } from '../types';

function getAction(actions: ActionTable<SessionRaw, TaskOptions>[], label: string) {
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
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    onPause: jest.fn(),
    onResume: jest.fn(),
    onCancel: jest.fn(),
    onPurge: jest.fn(),
    onClose: jest.fn(),
    onDelete: jest.fn(),
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

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        SessionsTableComponent,
        { provide: SessionsDataService, useValue: mockSessionsDataService },
        { provide: NotificationService, useValue: mockNotificationService },
        SessionsStatusesService,
        FiltersService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: TasksByStatusService, useValue: mockTasksByStatusService},
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Router, useValue: mockRouter }
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
      raw: {
        sessionId: 'sessionId'
      }
    } as unknown as SessionData);
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
    const sessionData = {
      raw: {
        sessionId: 'sessionId',
        status: SessionStatus.SESSION_STATUS_RUNNING
      },
      resultsQueryParams: {
        '0-root-1-0': 'sessionId'
      }
    } as unknown as SessionData;

    it('should copy', () => {
      const spy = jest.spyOn(component, 'onCopiedSessionId');
      const action = getAction(component.actions, 'Copy session ID');
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(sessionData);
    });

    it('should permit to see session', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      const action = getAction(component.actions, 'See session');
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(['/sessions', sessionData.raw.sessionId]);
    });

    it('should permit to see results', () => {
      const spy = jest.spyOn(component.router, 'navigate');
      const action = getAction(component.actions, 'See results');
      action.action$.next(sessionData);
      expect(spy).toHaveBeenCalledWith(['/results'], { queryParams: sessionData.resultsQueryParams });
    });

    describe('Pause', () => {
      it('should check if a session can be paused', () => {
        const action = getAction(component.actions, 'Pause session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(true);
        }
      });
  
      it('should pause a session', () => {
        const action = getAction(component.actions, 'Pause session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onPause).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
    });

    describe('Resume', () => {
      it('should check if a session can be resumed', () => {
        const action = getAction(component.actions, 'Resume session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(false);
        }
      });
  
      it('should resume a session', () => {
        const action = getAction(component.actions, 'Resume session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onResume).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
    });

    describe('Purge', () => {
      it('should check if a session can be purged', () => {
        const action = getAction(component.actions, 'Purge session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(false);
        }
      });
  
      it('should purge a session', () => {
        const action = getAction(component.actions, 'Purge session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onPurge).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
    });

    describe('Cancel', () => {
      it('should check if a session can be cancelled', () => {
        const action = getAction(component.actions, 'Cancel session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(true);
        }
      });
  
      it('should cancel a session', () => {
        const action = getAction(component.actions, 'Cancel session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onCancel).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
    });

    describe('Close', () => {
      it('should check if a session can be closed', () => {
        const action = getAction(component.actions, 'Close session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(true);
        }
      });
  
      it('should close a session', () => {
        const action = getAction(component.actions, 'Close session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onClose).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
    });

    describe('Delete', () => {
      it('should check if a session can be deleted', () => {
        const action = getAction(component.actions, 'Delete session');
        if (action.condition) {
          expect(action.condition(sessionData)).toBe(true);
        }
      });
  
      it('should delete a session', () => {
        const action = getAction(component.actions, 'Delete session');
        action.action$.next(sessionData);
        expect(mockSessionsDataService.onDelete).toHaveBeenCalledWith(sessionData.raw.sessionId);
      });
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
    expect(component.displayedColumns).toEqual(displayedColumns);
  });
});