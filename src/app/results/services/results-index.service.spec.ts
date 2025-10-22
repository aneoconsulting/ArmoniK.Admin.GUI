import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ResultsIndexService } from './results-index.service';
import { ResultRawColumnKey, ResultRawListOptions } from '../types';


describe('ResultsIndexService', () => {
  let service: ResultsIndexService;

  const defaultConfig = new DefaultConfigService();

  const storedOptions: ResultRawListOptions = {
    pageIndex: 2,
    pageSize: 25,
    sort: {
      active: 'createdAt',
      direction: 'asc'
    },
  };
  const defaultOptions: ResultRawListOptions = defaultConfig.defaultResults.options;

  const storedColumns: ResultRawColumnKey[] = ['resultId', 'sessionId'];
  const defaultColumns = defaultConfig.defaultResults.columns;

  const defaultIntervalValue = defaultConfig.defaultResults.interval;
  const defaultLockColumnsValue = defaultConfig.defaultResults.lockColumns;

  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn((): number | null => 100),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn((): boolean | null => true),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn((): ResultRawListOptions | null => storedOptions),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn((): ResultRawColumnKey[] | null => storedColumns),
    resetColumns: jest.fn(),
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ResultsIndexService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(ResultsIndexService);
  });

  test('Create ResultsIndexService', () => {
    expect(service).toBeTruthy();
  });

  describe('availableTableColumns', () => {
    it('should expose an "Actions" column for table actions (incl. download)', () => {
      const actionsCol = service.availableTableColumns.find((c) => c.key === 'actions');
      expect(actionsCol).toBeTruthy();
      expect(actionsCol?.type).toBe('actions');
      expect(actionsCol?.sortable).toBe(false);
      expect(actionsCol?.name).toBeDefined();
    });

    it('should expose link columns with correct routes', () => {
      const ownerTaskId = service.availableTableColumns.find((c) => c.key === 'ownerTaskId');
      const sessionId = service.availableTableColumns.find((c) => c.key === 'sessionId');
      const resultId = service.availableTableColumns.find((c) => c.key === 'resultId');

      expect(ownerTaskId?.type).toBe('link');
      expect(ownerTaskId?.link).toBe('/tasks');

      expect(sessionId?.type).toBe('link');
      expect(sessionId?.link).toBe('/sessions');

      expect(resultId?.type).toBe('link');
      expect(resultId?.link).toBe('/results');
    });

    it('should contain expected column keys', () => {
      const keys = service.availableTableColumns.map((c) => c.key);
      expect(keys).toEqual(
        expect.arrayContaining([
          'name',
          'status',
          'ownerTaskId',
          'createdBy',
          'createdAt',
          'sessionId',
          'resultId',
          'size',
          'manualDeletion',
          'opaqueId',
          'actions',
        ]),
      );
    });
  });

  describe('Interval', () => {
    it('should call saveIntervalValue from TableService', () => {
      service.saveIntervalValue(9);
      expect(mockTableService.saveIntervalValue).toHaveBeenCalledWith('results-interval', 9);
    });

    it('should call restoreIntervalValue from TableService', () => {
      expect(service.restoreIntervalValue()).toEqual(100);
    });

    it('should return defaultIntervalValue when restoreIntervalValue from TableService returns null', () => {
      mockTableService.restoreIntervalValue.mockReturnValueOnce(null);
      expect(service.restoreIntervalValue()).toEqual(defaultIntervalValue);
    });
  });

  describe('Lock columns', () => {
    it('should call saveLockColumns from TableService', () => {
      service.saveLockColumns(true);
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('results-lock-columns', true);
    });

    it('should call restoreLockColumns from TableService', () => {
      expect(service.restoreLockColumns()).toEqual(true);
    });

    it('should return defaultLockColumn when restoreLockColumns from TableService returns null', () => {
      mockTableService.restoreLockColumns.mockReturnValueOnce(null);
      expect(service.restoreLockColumns()).toEqual(defaultLockColumnsValue);
    });
  });

  describe('Options', () => {
    it('should call saveOptions from TableService', () => {
      service.saveOptions(defaultOptions);
      expect(mockTableService.saveOptions).toHaveBeenCalledWith('results-options', defaultOptions);
    });

    it('should call restoreOptions from TableService', () => {
      expect(service.restoreOptions()).toEqual(storedOptions);
    });
  });

  describe('Columns', () => {
    it('should call saveColumns from TableService', () => {
      const columns: ResultRawColumnKey[] = ['createdAt', 'actions', 'sessionId'];
      service.saveColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('results-columns', columns);
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
      expect(mockTableService.resetColumns).toHaveBeenCalledWith('results-columns');
      expect(service.resetColumns()).toEqual(defaultColumns);
    });
  });
});