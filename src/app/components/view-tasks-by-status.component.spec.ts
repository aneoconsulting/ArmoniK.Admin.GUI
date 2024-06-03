import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount } from '@app/tasks/types';
import { TaskStatusColored } from '@app/types/dialog';
import { ViewTasksByStatusComponent } from './view-tasks-by-status.component';

describe('ViewTasksByStatusComponent', () => {
  let component: ViewTasksByStatusComponent;
  let fixture: ComponentFixture<ViewTasksByStatusComponent>;

  const defaultQueryParams = {
    '0-root-1-0': 'sessionId',
    '1-options-1-1': 'applicationName'
  };

  const initialStatuses: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_CANCELLED,
      color: 'red'
    },
    {
      status: TaskStatus.TASK_STATUS_PROCESSING,
      color: 'blue'
    },
  ];

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
    component.defaultQueryParams = defaultQueryParams;
    component.statuses = initialStatuses;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  test('createQueryParams should return the params in a record', () => {
    expect(component.createQueryParams(TaskStatus.TASK_STATUS_COMPLETED)).toEqual({
      ...defaultQueryParams,
      '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
      '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
    });
  });

  test('tooltip should get the label of a status ', () => {
    expect(component.tooltip(TaskStatus.TASK_STATUS_COMPLETED)).toEqual('Completed');
  });

  test('completeStatus should complete the missing fields of a status', () => {
    expect(component.completeStatus({status: TaskStatus.TASK_STATUS_COMPLETED, color: 'green'}))
      .toEqual({
        status: TaskStatus.TASK_STATUS_COMPLETED,
        color: 'green',
        statusCount: 0,
        tooltip: 'Completed',
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
        }
      });
  });

  it('should handle statuses on init', () => {
    expect(component.statuses).toEqual([
      {
        status: TaskStatus.TASK_STATUS_CANCELLED,
        color: 'red',
        statusCount: 0,
        tooltip: 'Cancelled',
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_CANCELLED.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_CANCELLED.toString()
        }
      },
      {
        status: TaskStatus.TASK_STATUS_PROCESSING,
        color: 'blue',
        statusCount: 0,
        tooltip: 'Processing',
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_PROCESSING.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_PROCESSING.toString()
        }
      }
    ]);
  });

  it('should update statusesCounts', () => {
    const statusesCounts: StatusCount[] = [
      {
        status: TaskStatus.TASK_STATUS_CANCELLED,
        count: 10
      }
    ];
    component.statusesCounts = statusesCounts;
    expect(component.statuses.map(status => status.statusCount)).toEqual([10, 0]);
  });

  it('should update statuses on new statuses', () => {
    const newStatuses: TaskStatusColored[] = [
      {
        status: TaskStatus.TASK_STATUS_CANCELLED,
        color: 'green'
      }
    ];
    component.statuses = newStatuses;
    expect(component.statuses).toEqual([
      {
        status: TaskStatus.TASK_STATUS_CANCELLED,
        color: 'green',
        statusCount: 0,
        tooltip: 'Cancelled',
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_CANCELLED.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_CANCELLED.toString()
        }
      }
    ]);
  });
});