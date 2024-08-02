import { GetTaskResponse, TaskDetailed } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { NotificationService } from '@services/notification.service';
import { ShareUrlService } from '@services/share-url.service';
import { TasksGrpcService } from './services/tasks-grpc.service';
import { TasksStatusesService } from './services/tasks-statuses.service';
import { ShowComponent } from './show.component';

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

  const returnedTask = {
    id: 'taskId-12345',
    options: {
      partitionId: 'partitionId'
    }
  } as unknown as TaskDetailed;
  const mockTasksGrpcService = {
    get$: jest.fn((): Observable<unknown> => of({task: returnedTask} as GetTaskResponse)),
    cancel$: jest.fn(() => of({}))
  };

  const mockTasksStatusesService = {
    statuses: []
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ShowComponent,
        IconsService,
        FiltersService,
        { provide: TasksStatusesService, useValue: mockTasksStatusesService},
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: ShareUrlService, useValue: mockShareUrlService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TasksGrpcService, useValue: mockTasksGrpcService }
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

  it('should set link for action', () => {
    component.setLink('session', 'sessions', 'sessionId-12345');
    expect(component.actionButtons[0].link).toEqual('/sessions/sessionId-12345');
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

    it('should catch errors', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      mockTasksGrpcService.get$.mockReturnValueOnce(throwError(() => new Error()));
      const spy = jest.spyOn(component, 'handleError');
      component.refresh.next();
      expect(spy).toHaveBeenCalled();
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

  describe('Cancel task', () => {
    it('should cancel tasks', () => {
      component.cancel();
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([returnedTask.id]);
    });

    it('should notify on success', () => {
      component.cancel();
      expect(mockNotificationService.success).toHaveBeenCalledWith('Task canceled');
    });

    it('should refresh on success', () => {
      const spy = jest.spyOn(component.refresh, 'next');
      component.cancel();
      expect(spy).toHaveBeenCalled();
    });

    it('should log errors', () => {
      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockTasksGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      component.cancel();
      expect(errorSpy).toHaveBeenCalled();
    });
  });

  it('should get statuses', () => {
    expect(component.statuses).toEqual(mockTasksStatusesService.statuses);
  });

  it('should get resultKeys', () => {
    expect(component.resultsKey()).toEqual('1-root-3-0');
  });

  describe('actions', () => {
    it('should cancel a task', () => {
      component.actionButtons.find(button => button.id === 'cancel')?.action$?.next();
      expect(mockTasksGrpcService.cancel$).toHaveBeenCalledWith([returnedTask.id]);
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