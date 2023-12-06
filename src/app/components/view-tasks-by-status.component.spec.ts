import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ViewTasksByStatusComponent } from './view-tasks-by-status.component';

describe('ViewTasksByStatusComponent', () => {
  let component: ViewTasksByStatusComponent;
  let fixture: ComponentFixture<ViewTasksByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ViewTasksByStatusComponent,
        TasksStatusesService
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTasksByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('findStatusCount', () => {
    it('should return the statusCount of the selected status', () => {
      component.statusesCounts = [
        {count: 3, status: TaskStatus.TASK_STATUS_COMPLETED},
        {count: 40, status: TaskStatus.TASK_STATUS_PROCESSING}
      ];
      expect(component.findStatusCount(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
        count: 3,
        status: TaskStatus.TASK_STATUS_COMPLETED
      });
    });

    it('should return undefined if there is no count for the selected status', () => {
      expect(component.findStatusCount(TaskStatus.TASK_STATUS_CANCELLED)).toBeUndefined();
    });

    it('should return undefined if there is no statusCount at all', () => {
      component.statusesCounts = null;
      expect(component.findStatusCount(TaskStatus.TASK_STATUS_COMPLETED)).toBeUndefined();
    });
  });

  test('createQueryParams should return the params in a record', () => {
    component.defaultQueryParams = {
      '0-options-1-2': TaskStatus.TASK_STATUS_CANCELLED.toString(),
      '1-root-0-1': TaskStatus.TASK_STATUS_PROCESSING.toString()
    };
    expect(component.createQueryParams(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
      '0-options-1-2': TaskStatus.TASK_STATUS_CANCELLED.toString(),
      '1-root-0-1': TaskStatus.TASK_STATUS_PROCESSING.toString(),
      '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
    });
  });

  test('tooltip should get the label of a status ', () => {
    expect(component.tooltip(TaskStatus.TASK_STATUS_COMPLETED)).toEqual('Completed');
  });

  test('trackByCount should return the status', () => {
    expect(component.trackByCount(0, {status: TaskStatus.TASK_STATUS_COMPLETED, color: 'red'}))
      .toEqual(TaskStatus.TASK_STATUS_COMPLETED);
  });
});