import { TestBed } from '@angular/core/testing';
import { CustomColumn } from '@app/types/data';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionsIndexService } from './sessions-index.service';
import { SessionRawColumnKey, SessionRawListOptions } from '../types';

describe('SessionsIndexService', () => {
  let service: SessionsIndexService;

  const defaultConfig = new DefaultConfigService();

  const storedOptions: SessionRawListOptions = {
    pageIndex: 0,
    pageSize: 100,
    sort: {
      active: 'createdAt',
      direction: 'desc'
    },
  };

  const storedColumns: SessionRawColumnKey[] = ['sessionId', 'createdAt', 'count', 'createdAt', 'actions'];
  const defaultColumns = defaultConfig.defaultSessions.columns;

  const storedIntervalValue = 100;
  const defaultIntervalValue = defaultConfig.defaultSessions.interval;

  const storedLockColumns = true;
  const defaultLockColumnsValue = defaultConfig.defaultSessions.lockColumns;

  const storedViewInLogs = {
    serviceIcon: 'heart',
    serviceName: 'Sessions',
    urlTemplate: 'https://grafana?sessionId=%sessionId'
  };

  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn((): number | null => storedIntervalValue),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn((): boolean | null => storedLockColumns),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn((): SessionRawListOptions | null => storedOptions),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn((): SessionRawColumnKey[] | null => storedColumns),
    resetColumns: jest.fn(),
    saveViewInLogs: jest.fn(),
    restoreViewInLogs: jest.fn((): { serviceIcon: string, serviceName: string, urlTemplate: string } | null => storedViewInLogs)
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsIndexService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(SessionsIndexService);
  });

  test('Create SessionsIndexService', () => {
    expect(service).toBeTruthy();
  });

  describe('Interval', () => {
    it('should call saveIntervalValue from TableService', () => {
      const interval = 9;
      service.saveIntervalValue(interval);
      expect(mockTableService.saveIntervalValue).toHaveBeenCalledWith('sessions-interval', interval);
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
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('sessions-lock-columns', true);
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
      const options: SessionRawListOptions = {
        pageIndex: 3,
        pageSize: 30,
        sort: {
          active: 'clientSubmission',
          direction: 'asc'
        }
      };
      service.saveOptions(options);
      expect(mockTableService.saveOptions).toBeCalledWith('sessions-options', options);
    });

    it('should call restoreOptions from TableService', () => {
      expect(service.restoreOptions()).toEqual(storedOptions);
    });
  });

  describe('Columns', () => {
    it('should call saveColumns from TableService', () => {
      const columns: SessionRawColumnKey[] = ['createdAt', 'actions', 'closedAt'];
      service.saveColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('sessions-columns', columns);
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
      expect(mockTableService.resetColumns).toHaveBeenCalledWith('sessions-columns');
    });

    it('should reset properly columns', () => {
      expect(service.resetColumns()).toEqual(defaultColumns);
    });
  });

  describe('Custom Columns', () => {
    const columns: CustomColumn[] = ['options.options.FastCompute', 'options.options.CustomColumn'];
    it('should create custom fields', () => {
      expect(service.customField('options.options.FastCompute')).toEqual('FastCompute');
    });

    it('should save custom columns', () => {
      service.saveCustomColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('sessions-custom-columns', columns);
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