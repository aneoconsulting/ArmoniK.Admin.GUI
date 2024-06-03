import { GetSessionResponse, SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { BehaviorSubject, Observable, lastValueFrom, of, throwError } from 'rxjs';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsStatusesService } from './services/sessions-statuses.service';
import { ShowComponent } from './show.component';
import { SessionRaw } from './types';

describe('AppShowComponent', () => {
  let component: ShowComponent;

  const sessionStatusesService = new SessionsStatusesService();

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
        { provide: Router, useValue: mockRouter }

      ]
    }).inject(ShowComponent);
    component.ngOnInit();
    component.ngAfterViewInit();
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
      const spy = jest.spyOn(component.data$, 'next');
      component.refresh.next();
      expect(component.data).toEqual(returnedSession);
      expect(spy).toHaveBeenCalledWith(returnedSession);
    });

    it('should not update data if there is none', () => {
      mockSessionsGrpcService.get$.mockImplementationOnce(() => of({}));
      const spy = jest.spyOn(component.data$, 'next');
      component.refresh.next();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });

    it('should update query params for partitions', () => {
      component.refresh.next();
      expect(component.actionButtons.find(button => button.id === 'partitions')?.queryParams)
        .toEqual({
          '0-root-1-0': 'partitionId1',
          '1-root-1-0': 'partitionId2'
        });
    });

    it('should update filter params for results', () => {
      component.refresh.next();
      expect(component.actionButtons.find(button => button.id === 'results')?.queryParams)
        .toEqual({
          '0-root-1-0': returnedSession.sessionId
        });
    });

    it('should update filter params for tasks', () => {
      component.refresh.next();
      expect(component.actionButtons.find(button => button.id === 'tasks')?.queryParams)
        .toEqual({
          '0-root-1-0': returnedSession.sessionId
        });
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
      expect(component.data?.duration).toEqual({
        seconds: '1000',
        nanos: 0
      });
    });
  });

  describe('Handle errors', () => {
    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      component.handleError(new Error());
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify the error', () => {
      component.handleError(new Error());
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

  describe('Cancel session', () => {
    it('should cancel sessions', () => {
      component.cancel();
      expect(mockSessionsGrpcService.cancel$).toHaveBeenCalledWith(returnedSession.sessionId);
    });

    it('should notify on success', () => {
      component.cancel();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session canceled');
    });

    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh, 'next');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });

    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.cancel();
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('should get statuses', () => {
    expect(component.statuses).toEqual(sessionStatusesService.statuses);
  });

  it('should get resultKeys', () => {
    expect(component.resultsKey).toEqual('0-root-1-0');
  });


  describe('cancel action', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      lastValueFrom(component.actionButtons.find(button => button.id === 'cancel')?.disabled as Observable<boolean>)
        .then(disabled => expect(disabled).toBeFalsy());
    });

    it('should notify on success when cancelling a session', () => {
      component.actionButtons.find(button => button.id === 'cancel')?.action$?.next();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session canceled');
    });

    it('should notify on errors when cancelling a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.actionButtons.find(button => button.id === 'cancel')?.action$?.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Pause action', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      lastValueFrom(component.actionButtons.find(button => button.id === 'pause')?.disabled as Observable<boolean>)
        .then(disabled => expect(disabled).toBeFalsy());
    });

    it('should notify on success when pausing a session', () => {
      component.actionButtons.find(button => button.id === 'pause')?.action$?.next();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session paused');
    });

    it('should notify on errors when pausing a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.pause$.mockReturnValueOnce(throwError(() => new Error()));
      component.actionButtons.find(button => button.id === 'pause')?.action$?.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Resume action', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      lastValueFrom(component.actionButtons.find(button => button.id === 'resume')?.disabled as Observable<boolean>)
        .then(disabled => expect(disabled).toBeTruthy());
    });

    it('should notify on success when resuming a session', () => {
      component.actionButtons.find(button => button.id === 'resume')?.action$?.next();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session resumed');
    });

    it('should notify on errors when resuming a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.resume$.mockReturnValueOnce(throwError(() => new Error()));
      component.actionButtons.find(button => button.id === 'resume')?.action$?.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Close action', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      lastValueFrom(component.actionButtons.find(button => button.id === 'close')?.disabled as Observable<boolean>)
        .then(disabled => expect(disabled).toBeFalsy());
    });

    it('should notify on success when closing a session', () => {
      component.actionButtons.find(button => button.id === 'close')?.action$?.next();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session closed');
    });

    it('should notify on errors when closing a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.close$.mockReturnValueOnce(throwError(() => new Error()));
      component.actionButtons.find(button => button.id === 'close')?.action$?.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });

  describe('Delete action', () => {
    beforeAll(() => {
      component.refresh.next(); // setting up the RUNNING status
    });

    it('should permit to cancel a session', () => {
      lastValueFrom(component.actionButtons.find(button => button.id === 'delete')?.disabled as Observable<boolean>)
        .then(disabled => expect(disabled).toBeFalsy());
    });

    it('should notify on success when deleting a session', () => {
      component.actionButtons.find(button => button.id === 'delete')?.action$?.next();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Session deleted');
    });

    it('should navigate to sessions list page after succesfully deleting a session', () => {
      component.actionButtons.find(button => button.id === 'delete')?.action$?.next();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    });

    it('should notify on errors when deleting a session', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockSessionsGrpcService.delete$.mockReturnValueOnce(throwError(() => new Error()));
      component.actionButtons.find(button => button.id === 'delete')?.action$?.next();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });
  });
});