import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TasksStatusesService } from './tasks-statuses.service';

describe('tasksStatusesService', () => {
  const service: TasksStatusesService = new TasksStatusesService();

  it('should create TasksStatusesService', () => {
    expect(service).toBeTruthy();
  });

  it('should return the right task status', () => {
    expect(service.statusToLabel(TaskStatus.TASK_STATUS_PROCESSED)).toBeDefined();
  });
  
  describe('isRetried', () => {
    it('should return true', () => {
      expect(service.isRetried(TaskStatus.TASK_STATUS_RETRIED)).toBeTruthy();
    });
  
    it('should return false ', () => {
      expect(service.isRetried(TaskStatus.TASK_STATUS_PROCESSED)).toBeFalsy();
    });
  });

  describe('taskNotEnded', () => {
    it('should return true if not ended', () => {
      expect(service.taskNotEnded(TaskStatus.TASK_STATUS_CREATING)).toBeTruthy();
    });

    it('should return false', () => {
      expect(service.taskNotEnded(TaskStatus.TASK_STATUS_PROCESSED)).toBeFalsy();
    });
  });
});