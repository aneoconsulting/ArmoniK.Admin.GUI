import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { StatusLabelColor } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { StorageService } from '@services/storage.service';
import { TasksStatusesService } from './tasks-statuses.service';

describe('tasksStatusesService', () => {
  let service: TasksStatusesService;

  const mockDefaultStatuses = {
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      color: 'red',
      label: 'Cancelled'
    }
  };

  const mockDefaultConfigService = {
    exportedDefaultConfig: {
      'tasks-statuses': mockDefaultStatuses,
    },
  };

  const mockStoredStatuses = {
    [TaskStatus.TASK_STATUS_CANCELLED]: {
      color: 'blue',
      label: 'Cancelled'
    }
  };

  const mockStorageService = {
    getItem: jest.fn((): unknown => mockStoredStatuses),
    setItem: jest.fn(),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksStatusesService,
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: StorageService, useValue: mockStorageService },
      ]
    }).inject(TasksStatusesService);
  });

  it('should create TasksStatusesService', () => {
    expect(service).toBeTruthy();
  });

  describe('initialisation', () => {
    beforeEach(() => {
      mockStorageService.getItem.mockReturnValueOnce(null);
    });

    it('should init the statuses with stored config', () => {
      expect(service.statuses).toEqual(mockStoredStatuses);
    });

    it('should init the statuses with default config', () => {
      const serviceWithDefault = TestBed.inject(TasksStatusesService);
      expect(serviceWithDefault.statuses).toEqual(mockDefaultStatuses);
    });
  });

  describe('updateStatuses', () => {
    const newStatuses = {
      [TaskStatus.TASK_STATUS_CANCELLED]: {
        label: 'Cancelled',
        color: 'green',
      }
    } as Record<TaskStatus, StatusLabelColor>;

    beforeEach(() => {
      service.updateStatuses(newStatuses);
    });

    it('should update the statuses', () => {
      expect(service.statuses[TaskStatus.TASK_STATUS_CANCELLED]).toEqual(newStatuses[TaskStatus.TASK_STATUS_CANCELLED]);
    });

    it('should store the new statuses', () => {
      expect(mockStorageService.setItem).toHaveBeenCalledWith('tasks-statuses', service.statuses);
    });
  });

  it('should retrieve the default statuses config', () => {
    expect(service.getDefault()).toEqual(mockDefaultConfigService.exportedDefaultConfig['tasks-statuses']);
  });
  
  it('should return the right task status', () => {
    expect(service.statusToLabel(TaskStatus.TASK_STATUS_CANCELLED)).toBeDefined();
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