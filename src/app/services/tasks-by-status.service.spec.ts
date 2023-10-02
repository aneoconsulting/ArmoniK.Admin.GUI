import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TaskStatusColored } from '@app/types/dialog';
import { DefaultConfigService } from './default-config.service';
import { StorageService } from './storage.service';
import { TasksByStatusService } from './tasks-by-status.service';



describe('tasksByStatusService', () => {
  let service: TasksByStatusService;
  const mockStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(), 
    'applications-tasks-by-status': [{'color': '#4caf50', 'status': 4}],
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
        {provide: StorageService, useValue: mockStorage}
         
      ]
    }).inject(TasksByStatusService);
  });

  test('it should create tasks by status', () =>{
    expect(service).toBeTruthy();
  }); 

  test('should have right default status colors', () => {
    expect(service.defaultStatuses).toEqual(mockTaskStatusColored);
  });

  test('should call getItem from Storage service ', () => {
    const table = 'applications';
    service.restoreStatuses(table);
    expect(mockStorage.getItem).toHaveBeenCalled();
  });

  test('should call saveItem from storage', () => {
    const table = 'applications';
    service.saveStatuses(table, mockStorage['applications-tasks-by-status']);
    expect(mockStorage.setItem).toHaveBeenCalled();
  });
   
});