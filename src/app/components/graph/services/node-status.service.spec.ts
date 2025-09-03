import { ResultStatus, SessionStatus, TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { ArmoniKGraphNode } from '@app/types/graph.types';
import { NodeStatusService } from './node-status.service';

describe('NodeStatusService', () => {
  let service: NodeStatusService<ArmoniKGraphNode>;

  const mockSessionsStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Running',
      color: 'green'
    })),
  };

  const mockTasksStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Completed',
      color: 'green'
    })),
  };

  const mockResultsStatuses = {
    statusToLabel: jest.fn(() => ({
      label: 'Completed',
      color: 'green'
    })),
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        NodeStatusService,
        { provide: SessionsStatusesService, useValue: mockSessionsStatuses },
        { provide: TasksStatusesService, useValue: mockTasksStatuses },
        { provide: ResultsStatusesService, useValue: mockResultsStatuses },
      ],
    }).inject(NodeStatusService);
  });

  describe('getNodeStatusData', () => {
    it('should return the running session label', () => {
      const node = {
        type: 'session',
        status: SessionStatus.SESSION_STATUS_RUNNING,
      } as ArmoniKGraphNode;
      expect(service.getNodeStatusData(node)).toEqual(
        mockSessionsStatuses.statusToLabel()
      );
    });
  
    it('should return the running task label', () => {
      const node = {
        type: 'task',
        status: TaskStatus.TASK_STATUS_COMPLETED,
      } as ArmoniKGraphNode;
      expect(service.getNodeStatusData(node)).toEqual(
        mockTasksStatuses.statusToLabel()
      );
    });
  
    it('should return the running result label', () => {
      const node = {
        type: 'result',
        status: ResultStatus.RESULT_STATUS_COMPLETED,
      } as ArmoniKGraphNode;
      expect(service.getNodeStatusData(node)).toEqual(
        mockResultsStatuses.statusToLabel()
      );
    });
      
  
    it('should get the default color', () => {
      const node = {
        type: 'unknown',
        status: ResultStatus.RESULT_STATUS_COMPLETED,
      } as unknown as ArmoniKGraphNode;
  
      expect(service.getNodeStatusData(node)).toEqual({
        label: 'Unknown',
        color: 'grey'
      });
    });
  });
});