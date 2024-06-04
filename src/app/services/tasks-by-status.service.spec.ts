import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TasksStatusesGroup } from '@app/dashboard/types';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import { TasksByStatusService } from './tasks-by-status.service';

describe('tasksByStatusService', () => {
  let service: TasksByStatusService;
  const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };
  const mockTaskStatusColored: TasksStatusesGroup[] = [
    {
      name: 'Completed',
      statuses: [TaskStatus.TASK_STATUS_COMPLETED],
      color: '#4caf50',
    },
    {
      name: 'Error',
      statuses: [TaskStatus.TASK_STATUS_ERROR, TaskStatus.TASK_STATUS_TIMEOUT],
      color: '#ff0000',
    },
  ];

  const mockDefaultConfigService = {
    defaultTasksByStatus: mockTaskStatusColored
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksByStatusService,
        { provide: DefaultConfigService, useValue: mockDefaultConfigService },
        { provide: StorageService, useValue: mockStorage }
      ]
    }).inject(TasksByStatusService);
  });

  it('should create tasks by status', () => {
    expect(service).toBeTruthy();
  });

  it('should have right default status colors', () => {
    expect(service.defaultStatuses).toEqual(mockTaskStatusColored);
  });

  it('should call getItem from Storage service ', () => {
    const table = 'applications';
    service.restoreStatuses(table);
    expect(mockStorage.getItem).toHaveBeenCalled();
  });

  it('should call saveItem from storage', () => {
    const table = 'applications';
    service.saveStatuses(table, mockTaskStatusColored);
    expect(mockStorage.setItem).toHaveBeenCalledWith(`${table}-tasks-by-status`, mockTaskStatusColored);
  });
});