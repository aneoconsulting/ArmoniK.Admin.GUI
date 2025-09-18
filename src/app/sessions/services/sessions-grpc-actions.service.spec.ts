import { SessionRaw, SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { GrpcAction } from '@app/types/actions.type';
import { StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { NotificationService } from '@services/notification.service';
import { of, Subject, throwError } from 'rxjs';
import { SessionsGrpcActionsService } from './sessions-grpc-actions.service';
import { SessionsGrpcService } from './sessions-grpc.service';

function getAction(actions: GrpcAction<SessionRaw>[], label: string) {
  return actions.filter(action => action.label === label)[0];
} 

describe('SessionsGrpcActionsService', () => {
  let service: SessionsGrpcActionsService;

  const session1 = {
    sessionId: 'session-1',
    status: SessionStatus.SESSION_STATUS_RUNNING
  } as SessionRaw;

  const session2 = {
    sessionId: 'session-2',
    status: SessionStatus.SESSION_STATUS_RUNNING
  } as SessionRaw;

  const mockGrpcService = {
    pause$: jest.fn(() => of([{session: session1}])),
    resume$: jest.fn(() => of([{session: session1}])),
    purge$: jest.fn(() => of([{session: session1}])),
    cancel$: jest.fn(() => of([{session: session1}])),
    close$: jest.fn(() => of([{session: session1}])),
    delete$: jest.fn(() => of([{session: session1}])),
  };

  const mockStatusesService = {
    canPause: jest.fn((status: SessionStatus) => status !== SessionStatus.SESSION_STATUS_PAUSED),
    canResume: jest.fn((status: SessionStatus) => status === SessionStatus.SESSION_STATUS_PAUSED),
    canCancel: jest.fn((status: SessionStatus) => status === SessionStatus.SESSION_STATUS_RUNNING),
    canPurge: jest.fn((status: SessionStatus) => status === SessionStatus.SESSION_STATUS_RUNNING),
    canClose: jest.fn((status: SessionStatus) => status === SessionStatus.SESSION_STATUS_RUNNING),
    canDelete: jest.fn((status: SessionStatus) => status !== SessionStatus.SESSION_STATUS_DELETED),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockParams:Record<string, string> = {};
  const mockRoute = {
    params: of(mockParams),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const refresh = {
    next: jest.fn(),
  } as unknown as Subject<void>;

  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsGrpcActionsService,
        { provide: SessionsGrpcService, useValue: mockGrpcService },
        { provide: StatusService, useValue: mockStatusesService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
      ],
    }).inject(SessionsGrpcActionsService);
    service.refresh = refresh;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('Pause', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Pause session');
    });

    it('should check if a session can be paused', () => {
      expect(action.condition!([session1])).toBe(true);
    });
  
    it('should pause a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session paused');
    });

    it('should pause many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions paused');
    });

    it('should catch errors', () => {
      mockGrpcService.pause$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error ocured while pausing session ' + session1.sessionId);
    });
  });

  describe('Resume', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Resume session');
    });

    it('should check if a session can be resumed', () => {
      expect(action.condition!([session1])).toBe(false);
    });
  
    it('should resume a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session resumed');
    });

    it('should resume many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions resumed');
    });

    it('should catch errors', () => {
      mockGrpcService.resume$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred while resuming session ' + session1.sessionId);
    });
  });

  describe('Purge', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Purge session');
    });

    it('should check if a session can be purged', () => {
      expect(action.condition!([session1])).toBe(true);
    });
  
    it('should purge a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session purged');
    });

    it('should purge many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions purged');
    });

    it('should catch errors', () => {
      mockGrpcService.purge$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred while purging session ' + session1.sessionId);
    });
  });

  describe('Cancel', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Cancel session');
    });

    it('should check if a session can be cancelled', () => {
      expect(action.condition!([session1])).toBe(true);
    });
  
    it('should cancel a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session cancelled');
    });

    it('should cancel many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions cancelled');
    });

    it('should catch errors', () => {
      mockGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred while cancelling session ' + session1.sessionId);
    });
  });

  describe('Close', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Close session');
    });

    it('should check if a session can be closed', () => {
      expect(action.condition!([session1])).toBe(true);
    });
  
    it('should close a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session closed');
    });

    it('should close many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions closed');
    });

    it('should catch errors', () => {
      mockGrpcService.close$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred while closing session ' + session1.sessionId);
    });
  });

  describe('Delete', () => {
    let action: GrpcAction<SessionRaw>;

    beforeEach(() => {
      action = getAction(service.actions, 'Delete session');
    });

    it('should check if a session can be deleted', () => {
      expect(action.condition!([session1])).toBe(true);
    });
  
    it('should delete a session', () => {
      action.click([session1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session deleted');
    });

    it('should delete many sessions', () => {
      action.click([session1, session2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Sessions deleted');
    });

    it('should navigate to sessions lists if there is an id in the query params', () => {
      mockParams['id'] = 'session-id';
      action.click([session1]);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should catch errors', () => {
      mockGrpcService.delete$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([session1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred while deleting session ' + session1.sessionId);
    });
  });

  describe('handleError', () => {
    const error = 'error' as unknown as GrpcStatusEvent;

    it('should log the error', () => {
      service['handleError'](error);
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    });

    it('should display a notification to the user', () => {
      service['handleError'](error);
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occurred.');
    });
    
    it('should display a notification to the user with a custom message', () => {
      const message = 'Session not closed';
      service['handleError'](error, message);
      expect(mockNotificationService.error).toHaveBeenCalledWith(message);
    });
  });
});