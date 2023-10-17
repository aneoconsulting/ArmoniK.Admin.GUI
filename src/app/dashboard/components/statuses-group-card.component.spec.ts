import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { FiltersService } from '@services/filters.service';
import { StatusesGroupCardComponent } from './statuses-group-card.component';

describe('StatusesGroupCardComponent', () => {
  let component: StatusesGroupCardComponent;

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        StatusesGroupCardComponent,
        TasksStatusesService,
        FiltersService
      ]
    }).inject(StatusesGroupCardComponent);
    component.group = { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]};
    component.hideGroupHeaders = false;
    component.data = [{status: TaskStatus.TASK_STATUS_COMPLETED, count: 143}, {status: TaskStatus.TASK_STATUS_PROCESSED, count: 153}];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get labels', () => {
    expect(component.statusToLabel(TaskStatus.TASK_STATUS_COMPLETED)).toEqual('Finished');
  });

  it('should update counter', () => {
    expect(component.updateCounter(TaskStatus.TASK_STATUS_COMPLETED)).toEqual(143);
  });

  it('should not update counter of not specified task', () => {
    expect(component.updateCounter(TaskStatus.TASK_STATUS_CANCELLING)).toEqual(0);
  });

  it('should return the number of every concerned tasks', () => {
    expect(component.sumStatusCount([TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_CANCELLED]))
      .toEqual(143);
  });

  it('should create query params', () => {
    expect(component.createQueryParam(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
      ['1-root-2-0']: TaskStatus.TASK_STATUS_COMPLETED
    });
  });
});