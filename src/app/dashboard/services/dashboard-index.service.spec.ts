import { TaskStatus } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { DefaultConfigService } from '@services/default-config.service';
import { DashboardIndexService } from './dashboard-index.service';
import { DashboardStorageService } from './dashboard-storage.service';
import { Line } from '../types';

describe('DashboardIndexService', () => {
  let service: DashboardIndexService;

  const mockDashboardStorageService = {
    restoreLines: jest.fn(),
    saveLines: jest.fn(),
    restoreSplitLines: jest.fn(),
    saveSplitLines: jest.fn()
  };

  const defaultValues = new DefaultConfigService();

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
        DashboardIndexService,
        DefaultConfigService,
        { provide: DashboardStorageService, useValue: mockDashboardStorageService },
        TasksStatusesService
      ]
    }).inject(DashboardIndexService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get statuses label', () => {
    expect(service.statuses().sort((a, b) => Number(a.value) - Number(b.value))).toEqual([
      { value: '0', name: 'Unspecified' },
      { value: '1', name: 'Creating' },
      { value: '2', name: 'Submitted' },
      { value: '3', name: 'Dispatched' },
      { value: '4', name: 'Finished' },
      { value: '5', name: 'Error' },
      { value: '6', name: 'Timeout' },
      { value: '7', name: 'Cancelling' },
      { value: '8', name: 'Cancelled' },
      { value: '9', name: 'Processing' },
      { value: '10', name: 'Processed' },
      { value: '11', name: 'Retried' }
    ]);
  });

  it('should restore lines', () => {
    mockDashboardStorageService.restoreLines.mockImplementationOnce(() => lines);
    expect(service.restoreLines()).toEqual(lines);
  });

  it('should restore default lines', () => {
    mockDashboardStorageService.restoreLines.mockImplementationOnce(() => null);
    expect(service.restoreLines()).toEqual(defaultValues.defaultDashboardLines);
  });

  it('should save lines', () => {
    service.saveLines(lines);
    expect(mockDashboardStorageService.saveLines).toHaveBeenCalledWith(lines);
  });

  it('should restore splited lines', () => {
    mockDashboardStorageService.restoreSplitLines.mockImplementationOnce(() => 4);
    expect(service.restoreSplitLines()).toEqual(4);
  });

  it('should restore default splited lines', () => {
    mockDashboardStorageService.restoreSplitLines.mockImplementationOnce(() => null);
    expect(service.restoreSplitLines()).toEqual(defaultValues.defaultDashboardSplitLines);
  });

  it('should save splited lines', () => {
    service.saveSplitLines(2);
    expect(mockDashboardStorageService.saveSplitLines).toHaveBeenCalledWith(2);
  });
});