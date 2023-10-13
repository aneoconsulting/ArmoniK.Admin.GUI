import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { StorageService } from '@services/storage.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

describe('DashboardStorageService', () => {
  let service: DashboardStorageService;

  const mockStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn()
  };

  const lines: Line[] = [
    {
      name: 'line1',
      interval: 10,
      hideGroupsHeader: false,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
      ],
    },
    {
      name: 'line2',
      interval: 20,
      hideGroupsHeader: true,
      filters: [],
      taskStatusesGroups: [
        { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
        { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
        { name: 'Unspecified', color: 'grey', statuses: [TaskStatus.TASK_STATUS_UNSPECIFIED, TaskStatus.TASK_STATUS_RETRIED]}
      ],
    }
  ];

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        DashboardStorageService,
        { provide: StorageService, useValue: mockStorageService }
      ]
    }).inject(DashboardStorageService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('shoud save lines', () => {
    service.saveLines(lines);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('dashboard-lines', lines);
  });

  it('should restore lines', () => {
    mockStorageService.getItem.mockImplementationOnce(() => lines);
    expect(service.restoreLines()).toEqual(lines);
  });

  it('should return null if there is no lines', () => {
    mockStorageService.getItem.mockImplementation(() => undefined);
    expect(service.restoreLines()).toEqual(null);
  });

  it('should save splited lines', () => {
    service.saveSplitLines(4);
    expect(mockStorageService.setItem).toHaveBeenCalledWith('dashboard-split-lines', 4);
  });

  it('should restore splited lines', () => {
    mockStorageService.getItem.mockImplementationOnce(() => 2);
    expect(service.restoreSplitLines()).toEqual(2);
  });

  it('should return null if there is no lines', () => {
    mockStorageService.getItem.mockImplementation(() => undefined);
    expect(service.restoreSplitLines()).toEqual(null);
  });
});