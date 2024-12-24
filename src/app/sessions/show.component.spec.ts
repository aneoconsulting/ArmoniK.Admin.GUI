import { GetSessionResponse, SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksInspectionService } from '@app/tasks/services/tasks-inspection.service';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsInspectionService } from './services/sessions-inspection.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { ShowComponent } from './show.component';
import { SessionRaw } from './types';

describe('AppShowComponent', () => {
  let component: ShowComponent;

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };

  const mockShareUrlService = {
    generateSharableURL: jest.fn(),
  };

  const paramId = 'paramId-12345';
  const mockActivatedRoute = {
    params: new BehaviorSubject({
      id: paramId,
    }),
  };

  const returnedSession = {
    sessionId: 'sessionId-12345',
    partitionIds: ['partitionId1', 'partitionId2'],
    options: {
      partitionId: 'partitionId1'
    },
    status: SessionStatus.SESSION_STATUS_RUNNING,
  } as SessionRaw;

  const taskCreatedAt: {date: Timestamp | undefined} = {
    date: {
      seconds: '1620000000',
      nanos: 0
    } as Timestamp
  };

  const taskEndedAt: {date: Timestamp | undefined} = {
    date: {
      seconds: '1620001000',
      nanos: 0
    } as Timestamp
  };

  const mockSessionsGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({session: returnedSession} as GetSessionResponse)),
    cancel$: jest.fn(() => of({})),
    purge$: jest.fn(() => of({})),
    pause$: jest.fn(() => of({})),
    resume$: jest.fn(() => of({})),
    close$: jest.fn(() => of({})),
    delete$: jest.fn(() => of({})),
    getTaskData$: jest.fn(() => of({})),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        SessionsStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionsGrpcService, useValue: mockSessionsGrpcService },
        { provide: Router, useValue: mockRouter },
        SessionsInspectionService,
        TasksInspectionService,
      ]
    }).inject(ShowComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  describe('Initialisation', () => {
    it('should set id', () => {
      expect(component.id).toEqual(paramId);
    });

    it('should set sharableURL', () => {
      expect(mockShareUrlService.generateSharableURL).toHaveBeenCalled();
    });

    it('should set fields', () => {
      expect(component.fields).toEqual((new SessionsInspectionService).fields);
    });

    it('should set optionsFields', () => {
      expect(component.optionsFields).toEqual((new TasksInspectionService).optionsFields);
    });

    it('should set arrays', () => {
      expect(component.arrays).toEqual((new SessionsInspectionService).arrays);
    });

    it('should set tasksKey', () => {
      expect(component.tasksKey).toEqual('0-root-1-0');
    });

    it('should set resultsKey', () => {
      expect(component.resultsKey).toEqual('0-root-1-0');
    });
  });

  it('should get icons', () => {
    expect(component.getIcon('refresh')).toEqual('refresh');
  });

  it('should refresh', () => {
    const spy = jest.spyOn(component.refresh, 'next');
    component.onRefresh();
    expect(spy).toHaveBeenCalled();
  });

  describe('Getting data', () => {
    it('should fetch data on refresh', () => {
      component.refresh.next();
      expect(mockSessionsGrpcService.get$).toHaveBeenCalledWith(paramId);
    });

    it('should update data on success', () => {
      component.refresh.next();
      expect(component.data()).toEqual(returnedSession);
    });

    it('should set taskQueryParams', () => {
      component.tasksQueryParams = {};
      component.refresh.next();
      expect(component.tasksQueryParams).toEqual({'0-root-1-0': returnedSession.sessionId});
    });

    it('should set resultsQueryParams', () => {
      component.resultsQueryParams = {};
      component.refresh.next();
      expect(component.resultsQueryParams).toEqual({'0-root-1-0': returnedSession.sessionId});
    });

    it('should not update data if there is none', () => {
      mockSessionsGrpcService.get$.mockImplementationOnce(() => of({}));
      component.refresh.next();
      expect(component.data()).toEqual(null);
    });

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Computing duration', () => {
    it('should get the lower date', () => {
      mockSessionsGrpcService.getTaskData$.mockReturnValueOnce(of(taskCreatedAt));
      component.lowerDuration$.next();
      expect(component.lowerDate).toEqual(taskCreatedAt.date);
    });

    it('should get the upper date', () => {
      mockSessionsGrpcService.getTaskData$.mockReturnValueOnce(of(taskEndedAt));
      component.upperDuration$.next();
      expect(component.upperDate).toEqual(taskEndedAt.date);
    });

    it('should compute the duration', () => {
      component.lowerDate = taskCreatedAt.date;
      component.upperDate = taskEndedAt.date;
      component.computeDuration$.next();
      expect(component.data()?.duration).toEqual(new Duration({
        seconds: '1000',
        nanos: 0
      }));
    });
  });

  describe('Handle errors', () => {
    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const errorMessage = 'ErrorMessage';
      component.handleError({statusMessage: errorMessage} as GrpcStatusEvent);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify the error', () => {
      const errorMessage = 'ErrorMessage';
      component.handleError({statusMessage: errorMessage} as GrpcStatusEvent);
      expect(mockNotificationService.error).toHaveBeenCalledWith('Could not retrieve data.');
    });
  });

  describe('notifications', () => {
    it('should notify on success', () => {
      const notification = 'message';
      component.success(notification);
      expect(mockNotificationService.success).toHaveBeenCalledWith(notification);
    });

    it('should notify on error', () => {
      const error = 'error message';
      component.error(error);
      expect(mockNotificationService.error).toHaveBeenCalledWith(error);
    });
  });

  describe('get status', () => {
    it('should return the status label if there is data', () => {
      component.refresh.next();
      expect(component.status).toEqual({
        color: '#008000',
        icon: 'play',
        label: 'Running'
      });
    });

    it('should return undefined if there is no data', () => {
      mockSessionsGrpcService.get$.mockReturnValueOnce(of(null));
      component.refresh.next();
      expect(component.status).toEqual(undefined);
    });
  });

  it('should get resultKeys', () => {
    expect(component.resultsKey).toEqual('0-root-1-0');
  });

  describe('Cancelling', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      expect(component.disableCancel).toBeFalsy();
    });

    it('should call grpc service "cancel$" method', () => {
      component.cancel();
      expect(mockSessionsGrpcService.cancel$).toHaveBeenCalled();
    });

    it('should notify on success when cancelling a session', () => {
      component.cancel();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session canceled');
    });

    it('should notify on errors when cancelling a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.cancel();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Purging', () => {
    beforeEach(() => {
      mockSessionsGrpcService.get$.mockReturnValueOnce(of({session: {
        sessionId: 'session-closed',
        partitionIds: ['partitionId1', 'partitionId2'],
        options: {
          partitionId: 'partitionId1'
        },
        status: SessionStatus.SESSION_STATUS_CLOSED
      }}));
      component.refresh.next(); // setting up the CLOSED status
    });

    it('should permit to purge a session', () => {
      expect(component.disablePurge).toBeFalsy();
    });

    it('should call grpc service "purge$" method', () => {
      component.purge();
      expect(mockSessionsGrpcService.purge$).toHaveBeenCalled();
    });

    it('should notify on success when purging a session', () => {
      component.purge();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session purged');
    });

    it('should notify on errors when purging a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.purge$.mockReturnValueOnce(throwError(() => new Error()));
      component.purge();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Pausing', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to pause a session', () => {
      expect(component.disablePause).toBeFalsy();
    });

    it('should call the grpc service "pause$" method', () => {
      component.pause();
      expect(mockSessionsGrpcService.pause$).toHaveBeenCalled();
    });

    it('should notify on success when pausing a session', () => {
      component.pause();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session paused');
    });

    it('should notify on errors when pausing a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.pause$.mockReturnValueOnce(throwError(() => new Error()));
      component.pause();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Resuming', () => {
    beforeEach(() => {
      const pausedSession = {
        sessionId: 'pausedSession',
        partitionIds: ['partitionId1', 'partitionId2'],
        status: SessionStatus.SESSION_STATUS_PAUSED
      } as SessionRaw;
      mockSessionsGrpcService.get$.mockReturnValueOnce(of(pausedSession));
      component.data.set(pausedSession); // setting up the PAUSE status
      component.afterDataFetching();
    });

    it('should permit to resume a session', () => {
      expect(component.disableResume).toBeFalsy();
    });

    it('should call the grpc service "resume$" method', () => {
      component.resume();
      expect(mockSessionsGrpcService.resume$).toHaveBeenCalled();
    });

    it('should notify on success when resuming a session', () => {
      component.resume();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session resumed');
    });

    it('should notify on errors when resuming a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.resume$.mockReturnValueOnce(throwError(() => new Error()));
      component.resume();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Closing', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to close a session', () => {
      expect(component.disableClose).toBeFalsy();
    });

    it('should call the grpc service "close$" method', () => {
      component.close();
      expect(mockSessionsGrpcService.close$).toHaveBeenCalled();
    });

    it('should notify on success when closing a session', () => {
      component.close();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session closed');
    });

    it('should notify on errors when closing a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.close$.mockReturnValueOnce(throwError(() => new Error()));
      component.close();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Deleting', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should call the grpc service "delete$" method', () => {
      component.deleteSession();
      expect(mockSessionsGrpcService.delete$).toHaveBeenCalled();
    });

    it('should notify on success when deleting a session', () => {
      component.deleteSession();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session deleted');
    });

    it('should navigate to sessions list page after succesfully deleting a session', () => {
      component.deleteSession();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should notify on errors when deleting a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.delete$.mockReturnValueOnce(throwError(() => new Error()));
      component.deleteSession();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('on destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe from subjects', () => {
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });
});