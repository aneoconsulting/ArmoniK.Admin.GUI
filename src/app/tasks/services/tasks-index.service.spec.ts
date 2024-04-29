import { TestBed } from '@angular/core/testing';
import { CustomColumn } from '@app/types/data';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksIndexService } from './tasks-index.service';
import { TaskSummaryColumnKey, TaskSummaryListOptions } from '../types';

describe('TasksIndexService', () => {
  let service: TasksIndexService;

  const defaultConfig = new DefaultConfigService();

  const storedOptions: TaskSummaryListOptions = {
    pageIndex: 0,
    pageSize: 100,
    sort: {
      active: 'createdAt',
      direction: 'desc'
    },
  };

  const storedColumns: TaskSummaryColumnKey[] = ['id', 'createdAt', 'countRetryOfIds', 'fetchedAt', 'actions'];
  const defaultColumns = defaultConfig.defaultTasks.columns;

  const storedIntervalValue = 100;
  const defaultIntervalValue = defaultConfig.defaultTasks.interval;

  const storedLockColumns = true;
  const defaultLockColumnsValue = defaultConfig.defaultTasks.lockColumns;

  const storedViewInLogs = {
    serviceIcon: 'heart',
    serviceName: 'Tasks',
    urlTemplate: 'https://grafana?taskId=%taskId'
  };

  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn((): number | null => storedIntervalValue),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn((): boolean | null => storedLockColumns),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn((): TaskSummaryListOptions | null => storedOptions),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn((): TaskSummaryColumnKey[] | null => storedColumns),
    resetColumns: jest.fn(),
    saveViewInLogs: jest.fn(),
    restoreViewInLogs: jest.fn((): { serviceIcon: string, serviceName: string, urlTemplate: string } | null => storedViewInLogs)
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksIndexService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(TasksIndexService);
  });

  test('Create TasksIndexService', () => {
    expect(service).toBeTruthy();
  });

  describe('Interval', () => {
    it('should call saveIntervalValue from TableService', () => {
      const interval = 9;
      service.saveIntervalValue(interval);
      expect(mockTableService.saveIntervalValue).toHaveBeenCalledWith('tasks-interval', interval);
    });

    it('should call restoreIntervalValue from TableService', () => {
      expect(service.restoreIntervalValue()).toEqual(storedIntervalValue);
    });

    it('should return defaultIntervalValue when restoreIntervalValue from TableService returns null', () => {
      mockTableService.restoreIntervalValue.mockReturnValueOnce(null);
      expect(service.restoreIntervalValue()).toEqual(defaultIntervalValue);
    });
  });

  describe('Lock columns', () => {
    it('should call saveLockColumns from TableService', () => {
      service.saveLockColumns(true);
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('tasks-lock-columns', true);
    });

    it('should call restoreLockColumns from TableService', () => {
      expect(service.restoreLockColumns()).toEqual(storedLockColumns);
    });

    it('should return defaultLockColumn when restoreLockColumns from TableService returns null', () => {
      mockTableService.restoreLockColumns.mockReturnValueOnce(null);
      expect(service.restoreLockColumns()).toEqual(defaultLockColumnsValue);
    });
  });

  describe('Options', () => {
    it('should call saveOptions from TableService', () => {
      const options: TaskSummaryListOptions = {
        pageIndex: 3,
        pageSize: 30,
        sort: {
          active: 'countRetryOfIds',
          direction: 'asc'
        }
      };
      service.saveOptions(options);
      expect(mockTableService.saveOptions).toBeCalledWith('tasks-options', options);
    });

    it('should call restoreOptions from TableService', () => {
      expect(service.restoreOptions()).toEqual(storedOptions);
    });
  });

  describe('Columns', () => {
    it('should call saveColumns from TableService', () => {
      const columns: TaskSummaryColumnKey[] = ['createdAt', 'actions', 'initialTaskId'];
      service.saveColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('tasks-columns', columns);
    });

    it('should call restoreColumns from TableService', () => {
      expect(service.restoreColumns()).toEqual(storedColumns);
    });

    it('should return defaultColums when restoreColumns from TableService returns null', () => {
      mockTableService.restoreColumns.mockReturnValueOnce(null);
      expect(service.restoreColumns()).toEqual(defaultColumns);
    });

    it('should call resetColumns from TableService', () => {
      service.resetColumns();
      expect(mockTableService.resetColumns).toHaveBeenCalledWith('tasks-columns');
    });

    it('should reset properly columns', () => {
      expect(service.resetColumns()).toEqual(defaultColumns);
    });
  });

  describe('View in logs', () => {
    it('should call saveViewInLongs from TableService', () => {
      const viewLogService = {
        serviceName: 'seq',
        serviceIcon: 'heart',
        urlTemplate: 'https://seq.com/'
      };
      service.saveViewInLogs(viewLogService.serviceIcon, viewLogService.serviceName, viewLogService.urlTemplate);
      expect(mockTableService.saveViewInLogs).toHaveBeenCalledWith('tasks-view-in-logs', viewLogService.serviceIcon, viewLogService.serviceName, viewLogService.urlTemplate);
    });

    it('should call restoreViewInLogs from TableService', () => {
      expect(service.restoreViewInLogs()).toEqual(storedViewInLogs);
    });

    it('should return a default view in logs configuration', () => {
      mockTableService.restoreViewInLogs.mockReturnValueOnce(null);
      expect(service.restoreViewInLogs()).toEqual(defaultConfig.defaultTasksViewInLogs);
    });
  });

  describe('Custom Columns', () => {
    const columns: CustomColumn[] = ['options.options.FastCompute', 'options.options.CustomColumn'];
    it('should create custom fields', () => {
      expect(service.customField('options.options.FastCompute')).toEqual('FastCompute');
    });

    it('should save custom columns', () => {
      service.saveCustomColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('tasks-custom-columns', columns);
    });

    it('should restore custom columns', () => {
      const columnsWithCustoms = [...columns, ...storedColumns];
      mockTableService.restoreColumns.mockReturnValueOnce(columnsWithCustoms);
      expect(service.restoreCustomColumns()).toEqual(columnsWithCustoms);
    });

    it('should restore empty columns by default', () => {
      mockTableService.restoreColumns.mockReturnValueOnce(null);
      expect(service.restoreCustomColumns()).toEqual([]);
    });
  });
});