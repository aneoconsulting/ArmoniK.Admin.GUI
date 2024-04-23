import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject, Subject } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { TaskSummaryFilters } from '@app/tasks/types';
import { TaskStatusColored } from '@app/types/dialog';
import { CountTasksByStatusComponent } from './count-tasks-by-status.component';

describe('CountTasksByStatusComponent', () => {
  
  let component: CountTasksByStatusComponent;

  const statuses: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_CREATING,
      color: 'blue'
    },
    {
      status: TaskStatus.TASK_STATUS_CANCELLED,
      color: 'red'
    }
  ];

  const finalStatusesCount = [
    {status: TaskStatus.TASK_STATUS_CREATING, count: 3},
    {status: TaskStatus.TASK_STATUS_CANCELLED, count: 5}
  ];

  const mockTasksGrpcService = {
    countByStatus$: jest.fn(() => {
      return subject;
    })
  };

  const filters: TaskSummaryFilters = [[{
    for: 'options',
    field: 1,
    value: 'myValue',
    operator: 2
  }]];

  const subject = new BehaviorSubject({
    status: finalStatusesCount
  });

  const refresh$ = new Subject<void>();
  const refreshSpy = jest.spyOn(refresh$, 'next');

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        CountTasksByStatusComponent,
        { provide: TasksGrpcService, useValue: mockTasksGrpcService },
        TasksFiltersService
      ]
    }).inject(CountTasksByStatusComponent);

    component.refresh = refresh$;
    component.filters = filters;
    component.statuses = statuses;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('setting statuses', () => {
    it('should set statuses', () => {
      expect(component.statuses).toEqual(statuses);
    });

    it('should refresh counts', () => {
      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe('setting filters', () => {
    it('should set filters', () => {
      expect(component.filters).toEqual(filters);
    });
    
    it('should subscribe to refresh', () => {
      expect(refresh$.observed).toBeTruthy();
    });

    it('should refresh counts', () => {
      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe('Refreshing', () => {
    beforeAll(() => {
      component.statusesCounts = null;
      component.refresh.next();
    });

    it('should call countByStatus$', () => {
      expect(mockTasksGrpcService.countByStatus$).toHaveBeenCalled();
    });

    it('should update statusesCounts', () => {
      expect(component.statusesCounts).toEqual(finalStatusesCount);
    });
  });
});