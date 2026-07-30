import { GetTaskResponse, TaskDetailed } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { FiltersService } from '@services/filters.service';
import { Subject } from 'rxjs';
import { InspectTaskActionsComponent } from './inspect-task-actions.component';

describe('InspectTaskActionsComponent', () => {
  let component: InspectTaskActionsComponent<ArmoniKGraphNode>;

  const getSubject = new Subject<GetTaskResponse>();
  const mockTasksGrpcService = {
    get$: jest.fn(() => getSubject),
  };

  const mockRouter = {
    navigate: jest.fn(),
  };

  const node = {
    id: 'taskId',
  } as ArmoniKGraphNode;

  const mockTask = {
    id: 'taskId',
    options: {
      paritionId: 'partitionId',
    },
    parentTaskIds: [
      'task-1', 'task-2', 'task-3'
    ],
    expectedOutputIds: [
      'result-1', 'result-2'
    ]
  } as unknown as TaskDetailed;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        InspectTaskActionsComponent,
        FiltersService,
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        { provide: Router, useValue: mockRouter },
      ]
    }).inject(InspectTaskActionsComponent);
    component.node = node;
    getSubject.next({task: mockTask} as GetTaskResponse);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialisation', () => {
    it('should subscribe to the grpc get event', () => {
      expect(getSubject.observed).toBeTruthy();
    });

    it('should retrieve task information', () => {
      expect(component.task()).toBe(mockTask);
    });
  });

  it('should redirect to the task page', () => {
    component.seeTask(mockTask);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks', mockTask.id]);
  });

  it('should redirect to the task partition', () => {
    component.seePartition(mockTask);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/partitions', mockTask.options?.partitionId]);
  });

  it('should redirect to the filtered task table', () => {
    component.listParentTasks(mockTask);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/tasks'],
      {
        queryParams: {
          '0-root-16-0': 'task-1',
          '1-root-16-0': 'task-2',
          '2-root-16-0': 'task-3',
        }
      }
    );
  });

  it('should redirect to the filtered result table', () => {
    component.listResults(mockTask);
    expect(mockRouter.navigate).toHaveBeenCalledWith(
      ['/results'],
      {
        queryParams: {
          '0-root-7-0': 'result-1',
          '1-root-7-0': 'result-2',
        }
      }
    );
  });


  describe('On destroy', () => {
    beforeEach(() => {
      component.ngOnDestroy();
    });

    it('should unsubscribe', () => {
      expect(component['subscriptions'].closed).toBeTruthy();
    });
  });
});