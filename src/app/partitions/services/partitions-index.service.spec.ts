import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { PartitionsIndexService } from './partitions-index.service';
import { PartitionRawColumnKey, PartitionRawListOptions } from '../types';


describe('PartitionsIndexService', () => {
  let service: PartitionsIndexService;

  const defaultConfig = new DefaultConfigService();

  const storedOptions: PartitionRawListOptions = {
    pageIndex: 2,
    pageSize: 25,
    sort: {
      active: 'podMax',
      direction: 'asc'
    },
  };
  const defaultOptions: PartitionRawListOptions = defaultConfig.defaultPartitions.options;

  const storedColumns: PartitionRawColumnKey[] = ['id', 'actions'];
  const defaultColumns = defaultConfig.defaultPartitions.columns;

  const defaultIntervalValue = defaultConfig.defaultPartitions.interval;
  const defaultLockColumnsValue = defaultConfig.defaultPartitions.lockColumns;

  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn((): number | null => 100),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn((): boolean | null => true),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn((): PartitionRawListOptions | null => storedOptions),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn((): PartitionRawColumnKey[] | null => storedColumns),
    resetColumns: jest.fn(),
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        PartitionsIndexService,
        DefaultConfigService,
        { provide: TableService, useValue: mockTableService }
      ]
    }).inject(PartitionsIndexService);
  });

  test('Create PartitionsIndexService', () => {
    expect(service).toBeTruthy();
  });

  describe('Interval', () => {
    it('should call saveIntervalValue from TableService', () => {
      service.saveIntervalValue(9);
      expect(mockTableService.saveIntervalValue).toHaveBeenCalledWith('partitions-interval', 9);
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
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('partitions-lock-columns', true);
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
      expect(mockTableService.saveOptions).toHaveBeenCalledWith('partitions-options', defaultOptions);
    });

    it('should call restoreOptions from TableService', () => {
      expect(service.restoreOptions()).toEqual(storedOptions);
    });
  });

  describe('Columns', () => {
    it('should call saveColumns from TableService', () => {
      const columns: PartitionRawColumnKey[] = ['parentPartitionIds', 'actions', 'id'];
      service.saveColumns(columns);
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('partitions-columns', columns);
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
      expect(mockTableService.resetColumns).toHaveBeenCalledWith('partitions-columns');
      expect(service.resetColumns()).toEqual(defaultColumns);
    });
  });
});