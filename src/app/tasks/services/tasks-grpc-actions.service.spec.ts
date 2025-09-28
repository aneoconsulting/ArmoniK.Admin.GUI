import { TaskStatus, TaskSummary } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { GrpcAction } from '@app/types/actions.type';
import { StatusService } from '@app/types/status';
import { GrpcStatusEvent } from '@ngx-grpc/common';
import { NotificationService } from '@services/notification.service';
import { of, Subject, throwError } from 'rxjs';
import { TasksGrpcActionsService } from './tasks-grpc-actions.service';
import { TasksGrpcService } from './tasks-grpc.service';

function getAction(actions: GrpcAction<TaskSummary>[], label: string) {
  return actions.filter(action => action.label === label)[0];
} 

describe('TasksGrpcActionsService', () => {
  let service: TasksGrpcActionsService;

  const task1 = {
    id: 'task-1',
    status: TaskStatus.TASK_STATUS_COMPLETED
  } as TaskSummary;

  const task2 = {
    id: 'task-2',
    status: TaskStatus.TASK_STATUS_COMPLETED
  } as TaskSummary;

  const mockGrpcService = {
    cancel$: jest.fn((tasks) => of({ tasks: [...tasks] })),
  };

  const mockStatusesService = {
    taskNotEnded: jest.fn((status: TaskStatus) => status !== TaskStatus.TASK_STATUS_COMPLETED),
  };

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
  };
  
  const refresh = {
    next: jest.fn(),
  } as unknown as Subject<void>;
  
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() =>{
    service = TestBed.configureTestingModule({
      providers: [
        TasksGrpcActionsService,
        { provide: TasksGrpcService, useValue: mockGrpcService },
        { provide: StatusService, useValue: mockStatusesService },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).inject(TasksGrpcActionsService);
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    service.refresh = refresh;
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('Cancel', () => {
    let action: GrpcAction<TaskSummary>;
  
    beforeEach(() => {
      action = getAction(service.actions, 'Cancel Task');
    });
  
    it('should check if a task can be cancelled', () => {
      expect(action.condition!([task1])).toBe(false);
    });
    
    it('should cancel a task', () => {
      action.click([task1]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Task cancelled');
    });
  
    it('should cancel many tasks', () => {
      action.click([task1, task2]);
      expect(mockNotificationService.success).toHaveBeenCalledWith('Tasks cancelled');
    });
  
    it('should catch errors', () => {
      mockGrpcService.cancel$.mockReturnValueOnce(throwError(() => new Error()));
      action.click([task1]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occured.');
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
      expect(mockNotificationService.error).toHaveBeenCalledWith('An error occured.');
    });
      
    it('should display a notification to the user with a custom message', () => {
      const message = 'Task not cancelled';
      service['handleError'](error, message);
      expect(mockNotificationService.error).toHaveBeenCalledWith(message);
    });
  });
});