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
    restoreLines: jest.fn((): Line[] | null => lines),
    saveLines: jest.fn(),
    restoreSplitLines: jest.fn((): number | null => 4),
    saveSplitLines: jest.fn()
  };

  const defaultValues = new DefaultConfigService();

  const lines: Line[] = [
    {
      name: 'line1',
      type: 'Tasks',
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
      type: 'Tasks',
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

  it('should restore lines', () => {
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

  it('should restore splitted lines', () => {
    expect(service.restoreSplitLines()).toEqual(4);
  });

  it('should restore default splitted lines', () => {
    mockDashboardStorageService.restoreSplitLines.mockImplementationOnce(() => null);
    expect(service.restoreSplitLines()).toEqual(defaultValues.defaultDashboardSplitLines);
  });

  it('should save splitted lines', () => {
    service.saveSplitLines(2);
    expect(mockDashboardStorageService.saveSplitLines).toHaveBeenCalledWith(2);
  });

  describe('Adding a line', () => {
    it('should push and save the line to the saved lines', () => {
      const newLine: Line = {
        name: 'line3',
        type: 'Tasks',
        interval: 30,
        hideGroupsHeader: false,
        filters: [],
        taskStatusesGroups: [
          { name: 'Success', color: 'green', statuses: [TaskStatus.TASK_STATUS_COMPLETED, TaskStatus.TASK_STATUS_PROCESSED]},
          { name: 'Running', color: 'yellow', statuses: [TaskStatus.TASK_STATUS_CREATING, TaskStatus.TASK_STATUS_PROCESSING]},
          { name: 'Error', color: 'red', statuses: [TaskStatus.TASK_STATUS_CANCELLED, TaskStatus.TASK_STATUS_TIMEOUT]}
        ],
      };
      const savedLines = lines;
      savedLines.push(newLine);

      service.addLine(newLine);
      expect(mockDashboardStorageService.saveLines).toHaveBeenCalledWith(savedLines);
    });
  });
});