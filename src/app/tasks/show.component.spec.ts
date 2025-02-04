import { CancelTasksResponse, GetTaskResponse, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GrpcBlockedEnum } from '@app/types/data';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksInspectionService } from './services/tasks-inspection.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { ShowComponent } from './show.component';
import { TaskRaw } from './types';

describe('AppShowComponent', () => {
  let component: ShowComponent;

  const mockNotificationService = {
    success: jest.fn(),
    warning: jest.fn(),
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

  const returnedTask = {
    id: 'taskId-12345',
    sessionId: 'sessionId',
    options: {
      partitionId: 'partitionId'
    },
    status: TaskStatus.TASK_STATUS_PROCESSING,
    parentTaskIds: [
      'sessionId',
      'taskId-789'
    ]
  } as TaskRaw;

  const mockTasksGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({ task: returnedTask } as GetTaskResponse)),
    cancel$: jest.fn((): Observable<CancelTasksResponse | GrpcBlockedEnum> => of(new CancelTasksResponse()))
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        TasksStatusesService,
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        TasksInspectionService
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
      expect(component.fields).toEqual((new TasksInspectionService).fields);
    });

    it('should set optionsFields', () => {
      expect(component.optionsFields).toEqual((new TasksInspectionService).optionsFields);
    });

    it('should set arrays', () => {
      expect(component.arrays).toEqual((new TasksInspectionService).arrays);
    });

    it('should set resultsKey', () => {
      expect(component.resultsKey).toEqual('0-root-3-0');
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

  describe('get status', () => {
    it('should return undefined if there is no data', () => {
      mockTasksGrpcService.get$.mockReturnValueOnce(of(null));
      jest.spyOn(console, 'error').mockImplementation(() => { });
      component.refresh.next();
      expect(component.status).toEqual(undefined);
    });

    it('should return the status label if there is data', () => {
      component.status = undefined;
      component.refresh.next();
      expect(component.status).toEqual({
        color: '#008000',
        icon: 'play',
        label: 'Processing'
      });
    });
  });

  describe('Getting data', () => {
    it('should fetch data on refresh', () => {
      component.refresh.next();
      expect(mockTasksGrpcService.get$).toHaveBeenCalledWith(paramId);
    });

    it('should update data on success', () => {
      expect(component.data()).toEqual(returnedTask);
    });

    it('should not update data if none is fetched', () => {
      mockTasksGrpcService.get$.mockImplementationOnce(() => of({}));
      component.refresh.next();
      expect(component.data()).toEqual(null);
    });

    it('should set resultsQueryParams', () => {
      expect(component.resultsQueryParams).toEqual({ '0-root-3-0': returnedTask.id });
    });

    it('should filter the sessionID from the parent tasks IDs', () => {
      expect(component.data()?.parentTaskIds).toEqual(returnedTask.parentTaskIds.filter(taskId => taskId !== returnedTask.sessionId));
    });

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => { });
      mockTasksGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Handle errors', () => {
    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      const errorMessage = 'ErrorMessage';
      component.handleError({ statusMessage: errorMessage } as GrpcStatusEvent);
      expect(errorSpy).toHaveBeenCalled();
    });

    it('should notify the error', () => {
      const errorMessage = 'ErrorMessage';
      component.handleError({ statusMessage: errorMessage } as GrpcStatusEvent);
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

  it('should get statuses', () => {
    expect(component.statuses).toEqual((new TasksStatusesService).statuses);
  });

  describe('cancelling', () => {
    beforeEach(() => {
      component.refresh.next(); // Setting the PROCESSING status.
    });

    it('should cancel a task', () => {
      component.cancel();
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([returnedTask.id]);
    });

    it('should notify on success', () => {
      component.cancel();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Task cancelled.');
    });

    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh, 'next');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });

    it('should display a message on blocked request', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {});
      mockTasksGrpcService.cancel$.mockReturnValueOnce(of(GrpcBlockedEnum.WAITING));
      component.cancel();
      expect(mockNotificationService.warning).toHaveBeenCalled();
    });

    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.cancel();
      expect(errorSpy).toHaveBeenCalled();
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