import { TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { Observable, Subject, of } from 'rxjs';
import { CountTasksByStatusComponent } from './count-tasks-by-status.component';

describe('CountTasksByStatusComponent', () => {

  let component: CountTasksByStatusComponent;

  const statusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR, TaskStatus.TASK_STATUS_TIMEOUT],
      color: '#ff0000',
    },
  ];

  const finalStatusesCount = [
    { status: TaskStatus.TASK_STATUS_CREATING, count: 3 },
    { status: TaskStatus.TASK_STATUS_CANCELLED, count: 5 }
  ];

  const mockTasksGrpcService = {
    countByStatus$: jest.fn((): Observable<{ status: StatusCount[] | null | undefined }> => of({ status: finalStatusesCount }))
  };

  const filters: TaskSummaryFilters = [[{
    for: 'options',
    field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
    value: 'sessionId',
    operator: 0
  }]];

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
    component.statusesGroups = statusesGroups;
    component.ngOnInit();
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should subscribe to refresh', () => {
      expect(refresh$.observed).toBeTruthy();
    });

    it('should set id', () => {
      expect(component.id).toEqual(filters[0][0].value);
    });

    it('should not set id if there is no filter value', () => {
      component.filters = [];
      component.initId();
      expect(component.id).toEqual(undefined);
    });
  });

  describe('setting statuses', () => {
    it('should set statusesGroups', () => {
      expect(component.statusesGroups).toEqual(statusesGroups);
    });

    it('should refresh counts', () => {
      expect(refreshSpy).toHaveBeenCalled();
    });
  });

  describe('setting filters', () => {
    it('should set filters', () => {
      expect(component.filters).toEqual(filters);
    });
  });

  describe('Refreshing', () => {
    it('should update statusesCounts', () => {
      refresh$.next();
      expect(component.statusesCount()).toEqual(finalStatusesCount);
    });

    it('should set null if there is no response status', () => {
      mockTasksGrpcService.countByStatus$.mockReturnValue(of({ status: undefined }));
      refresh$.next();
      expect(component.statusesCount()).toEqual([]);
    });
  });
});