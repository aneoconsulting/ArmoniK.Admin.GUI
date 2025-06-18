import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ViewTasksByStatusComponent } from './view-tasks-by-status.component';

describe('ViewTasksByStatusComponent', () => {
  let component: ViewTasksByStatusComponent;
  let fixture: ComponentFixture<ViewTasksByStatusComponent>;

  const defaultQueryParams = {
    '0-root-1-0': 'sessionId',
    '1-options-1-1': 'applicationName'
  };

  const initialStatusesGroups: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: 'green',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR, TaskStatus.TASK_STATUS_TIMEOUT],
      color: 'red',
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
    component.statusesGroups = initialStatusesGroups;
  });

  it('Should run', () => {
    expect(component).toBeTruthy();
  });

  describe('createQueryParams', () => {
    it('should return the params in a record', () => {
      expect(component.createQueryParams(initialStatusesGroups[0])).toEqual({
        ...defaultQueryParams,
        '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
        '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
      });
    });

    it('should return the params in a record without any query params', () => {
      component.defaultQueryParams = {};
      expect(component.createQueryParams(initialStatusesGroups[0])).toEqual({
        '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
      });
    });
  });

  it('should complete the missing fields of a group', () => {
    expect(component.completeGroup(initialStatusesGroups[0]))
      .toEqual({
        ...initialStatusesGroups[0],
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
        }
      });
  });

  it('should handle statuses on init', () => {
    expect(component.groups).toEqual([
      {
        ...initialStatusesGroups[0],
        queryParams: {
          ...defaultQueryParams,
          '0-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString(),
          '1-root-2-0': TaskStatus.TASK_STATUS_COMPLETED.toString()
        }
      },
      {
        ...initialStatusesGroups[1],
        queryParams: {
          '0-root-1-0': 'sessionId',
          '0-root-2-0': TaskStatus.TASK_STATUS_ERROR.toString(),
          '1-root-1-0': 'sessionId',
          '1-root-2-0': TaskStatus.TASK_STATUS_TIMEOUT.toString(),
          '2-options-1-1': 'applicationName',
          '2-root-2-0': TaskStatus.TASK_STATUS_ERROR.toString(),
          '3-options-1-1': 'applicationName',
          '3-root-2-0': TaskStatus.TASK_STATUS_TIMEOUT.toString()
        }
      }
    ]);
  });

  it('should update the statusCount for each group', () => {
    const completedStatusCount = 5;
    const errorStatusCount = 10;
    const timeoutStatusCount = 15;
    component.statusesCount = [
      { status: TaskStatus.TASK_STATUS_COMPLETED, count: completedStatusCount },
      { status: TaskStatus.TASK_STATUS_ERROR, count: errorStatusCount },
      { status: TaskStatus.TASK_STATUS_TIMEOUT, count: timeoutStatusCount },
    ];
    expect(component.groups.map(group => group.statusCount)).toEqual([completedStatusCount, errorStatusCount + timeoutStatusCount]);
  });
});