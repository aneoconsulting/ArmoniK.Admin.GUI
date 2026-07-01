import { GetSessionResponse, SessionStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { TasksInspectionService } from '@app/tasks/services/tasks-inspection.service';
import { GrpcActionsService } from '@app/types/services/grpc-actions.service';
import { StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { SessionsGrpcService } from './services/sessions-grpc.service';
import { SessionsInspectionService } from './services/sessions-inspection.service';
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
    getTaskData$: jest.fn(() => of({})),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const mockStatusService = {
    statuses: {
      [SessionStatus.SESSION_STATUS_RUNNING]: {
        label: 'Running',
        color: 'green'
      },
    },
  };

  const mockGrpcActionsService = {
    actions: [],
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        { provide: StatusService, useValue: mockStatusService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: SessionsGrpcService, useValue: mockSessionsGrpcService },
        { provide: Router, useValue: mockRouter },
        SessionsInspectionService,
        TasksInspectionService,
        { provide: GrpcActionsService, useValue: mockGrpcActionsService },
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
      expect(component.status).toEqual(mockStatusService.statuses[SessionStatus.SESSION_STATUS_RUNNING]);
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

  describe('on destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe from subjects', () => {
      expect(component.subscriptions.closed).toBeTruthy();
    });
  });
});