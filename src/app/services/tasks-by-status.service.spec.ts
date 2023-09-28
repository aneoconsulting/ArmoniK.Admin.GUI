import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TaskStatusColored } from '@app/types/dialog';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import { TasksByStatusService } from './tasks-by-status.service';

type TableTasksByStatus = 'applications' | 'sessions' | 'partitions';


describe('tasksByStatusService', () => {
  let service: TasksByStatusService;
  const mockStorageService = {
    getItem: jest.fn(),
    setItem: jest.fn()
  };
  const mockTaskStatusColored: TaskStatusColored[] = [
    {
      status: TaskStatus.TASK_STATUS_COMPLETED,
      color: '#4caf50',
    },
    {
      status: TaskStatus.TASK_STATUS_ERROR,
      color: '#ff0000',
    },
    {
      status: TaskStatus.TASK_STATUS_TIMEOUT,
      color: '#ff6944',
    },
    {
      status: TaskStatus.TASK_STATUS_RETRIED,
      color: '#ff9800',
    },
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksByStatusService,
        DefaultConfigService,
        {provide: StorageService, useValue: mockStorageService}
         
      ]
    }).inject(TasksByStatusService);
  });

  test('it should create tasks by status', () =>{
    expect(service).toBeTruthy();
  }); 

  test('should have right default status colors', () => {
    expect(service.defaultStatuses).toEqual(mockTaskStatusColored);
  });

  it('should return all avalaible default colors for tasks status', () => {
    const table = 'applications';
    expect(service.restoreStatuses(table)).toEqual(mockTaskStatusColored);
  });
  
  it('should return all avalaible default colors for tasks status', () => {
    const table = 'applications';
    expect(service.restoreStatuses(table)).toEqual(mockTaskStatusColored);
  });
  
});