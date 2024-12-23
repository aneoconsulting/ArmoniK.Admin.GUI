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

  it('should get statuses label', () => {
    expect(service.statusesRecord().sort((a, b) => Number(a.value) - Number(b.value)).map((value) => ({value: value.value, name: value.name.label}))).toEqual([
      { value: '0', name: 'Unspecified' },
      { value: '1', name: 'Creating' },
      { value: '2', name: 'Submitted' },
      { value: '3', name: 'Dispatched' },
      { value: '4', name: 'Completed' },
      { value: '5', name: 'Error' },
      { value: '6', name: 'Timeout' },
      { value: '7', name: 'Cancelling' },
      { value: '8', name: 'Cancelled' },
      { value: '9', name: 'Processing' },
      { value: '10', name: 'Processed' },
      { value: '11', name: 'Retried' },
      { value: '12', name: 'Pending' },
      { value: '13', name: 'Paused' }
    ]);
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