import { CountTasksByStatusResponse, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { TasksFiltersService } from '@app/tasks/services/tasks-filters.service';
import { TasksGrpcService } from '@app/tasks/services/tasks-grpc.service';
import { CountTasksByStatusComponent } from './count-tasks-by-status.component';

describe('CountTasksByStatusComponent', () => {
  
  let component: CountTasksByStatusComponent;
  const finalStatusesCount = [
    {status: TaskStatus.TASK_STATUS_CREATING, count: 3},
    {status: TaskStatus.TASK_STATUS_CANCELLED, count: 5}
  ];
  const subject = new BehaviorSubject({
    status: finalStatusesCount
  });

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        CountTasksByStatusComponent,
        { provide: TasksGrpcService, useValue: {
          countByStatu$: () => {
            return subject as unknown as CountTasksByStatusResponse;
          }
        }},
        TasksFiltersService
      ]
    }).inject(CountTasksByStatusComponent);

    component.filters = [[{
      for: 'options',
      field: 1,
      value: 'myValue',
      operator: 2
    }]];
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  it('Should unsubscribe when destroyed', () => {
    component.ngOnDestroy();
    expect(subject.observed).toBeFalsy();
  });
});