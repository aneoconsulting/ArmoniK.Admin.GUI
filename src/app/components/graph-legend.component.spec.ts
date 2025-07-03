import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { IconsService } from '@services/icons.service';
import { GraphLegendComponent } from './graph-legend.component';

describe('GraphLegendComponent', () => {
  let component: GraphLegendComponent;

  const mockTasksStatusesService = {
    statuses: {
      [TaskStatus.TASK_STATUS_CANCELLED]: {
        label: 'cancelled'
      },
      [TaskStatus.TASK_STATUS_CREATING]: {
        label: 'creating'
      },
    },
  };

  const mockSessionsStatusesService = {
    statuses: {
      [SessionStatus.SESSION_STATUS_CANCELLED]: {
        label: 'Cancelled',
      },
      [SessionStatus.SESSION_STATUS_CLOSED]: {
        label: 'Closed',
      },
    },
  };

  const mockResultsStatusesService = {
    statuses: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed'
      },
    },
  };

  const mockIconsService = {
    getIcon: jest.fn(),
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        GraphLegendComponent,
        { provide: SessionsStatusesService, useValue: mockSessionsStatusesService },
        { provide: TasksStatusesService, useValue: mockTasksStatusesService },
        { provide: ResultsStatusesService, useValue: mockResultsStatusesService },
        { provide: IconsService, useValue: mockIconsService },
      ]
    }).inject(GraphLegendComponent);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialisation', () => {
    it('should set sessionsStatuses', () => {
      expect(component.sessionsStatuses).toEqual([SessionStatus.SESSION_STATUS_CANCELLED, SessionStatus.SESSION_STATUS_CLOSED]);
    });

    it('should set TaskStatuses', () => {
      expect(component.tasksStatuses).toEqual([TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_CANCELLING]);
    });

    it('should set resultsStatuses', () => {
      expect(component.resultsStatuses).toEqual([ResultStatus.RESULT_STATUS_ABORTED, ResultStatus.RESULT_STATUS_COMPLETED]);
    });
  });

  it('should get icons', () => {
    const icon = 'heart';
    component.getIcon(icon);
    expect(mockIconsService.getIcon).toHaveBeenCalledWith(icon);
  });
});