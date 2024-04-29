import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationsIndexService } from './applications-index.service';
import { ApplicationRawColumnKey, ApplicationRawListOptions } from '../types';


describe('TasksIndexService', () => {
  let service: ApplicationsIndexService; 

  const defaultConfig = new DefaultConfigService();

  const storedOptions: ApplicationRawListOptions = {
    pageIndex: 1,
    pageSize: 10,
    sort: {
      active: 'service',
      direction: 'asc'
    }
  };

  const storedColumns: ApplicationRawColumnKey[] = ['service', 'actions', 'name'];
  const defaultColumns = defaultConfig.defaultApplications.columns;

  const storedIntervalValue = 5;
  const defaultIntervalValue = defaultConfig.defaultApplications.interval;
  
  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn((): number | null => storedIntervalValue),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn((): ApplicationRawListOptions | null => storedOptions),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn((): ApplicationRawColumnKey[] | null => storedColumns),
    resetColumns: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn((): boolean | null => true),
  };

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        ApplicationsIndexService,
        DefaultConfigService,
        {provide: TableService, useValue: mockTableService}
      ]
    }).inject(ApplicationsIndexService);
  }); 

  test('Create ApplicationsIndexService', ()=> {
    expect(service).toBeTruthy();
  });

  describe('Interval', ()=>{
    it('should call saveIntervalValue from TableService', ()=>{
      service.saveIntervalValue(9);
      expect(mockTableService.saveIntervalValue).toBeCalledWith('applications-interval', 9);
    });

    it('should call restoreIntervalValue from TableService', ()=>{
      service.restoreIntervalValue();
      expect(mockTableService.restoreIntervalValue).toHaveBeenCalledWith('applications-interval');
    });

    it('should return defaultIntervalValue when restoreIntervalValue from TableService returns null', () => {
      mockTableService.restoreIntervalValue.mockReturnValueOnce(null);
      expect(service.restoreIntervalValue()).toEqual(defaultIntervalValue);
    });  

  });

  describe('Options', ()=>{
    it('should call saveOptions from TableService', ()=>{
      const newOptions: ApplicationRawListOptions = {
        pageIndex: 2,
        pageSize: 20,
        sort: {
          active: 'version',
          direction: 'asc'
        }
      };
      service.saveOptions(newOptions);
      expect(mockTableService.saveOptions).toHaveBeenCalledWith('applications-options', newOptions);
    });

    it('should call restoreOptions from TableService', ()=>{
      expect(service.restoreOptions()).toEqual(storedOptions);
    });
  });

  describe('Columns', ()=>{
    it('should call saveColumns from TableService', ()=>{
      const columns: ApplicationRawColumnKey[] = ['namespace', 'actions', 'version'];
      service.saveColumns(columns); 
      expect(mockTableService.saveColumns).toHaveBeenCalledWith('applications-columns', columns);
    });

    it('should call restoreColumns from TableService', ()=>{
      expect(service.restoreColumns()).toEqual(storedColumns);
    });

    it('should return defaultColums when restoreColumns from TableService returns null', ()=>{
      mockTableService.restoreColumns.mockReturnValueOnce(null);
      expect(service.restoreColumns()).toEqual(defaultColumns);
    });

    it('should call resetColumns from TableService', ()=>{
      const columns = service.resetColumns(); 
      expect(mockTableService.resetColumns).toHaveBeenCalledWith('applications-columns');
      expect(columns).toEqual(defaultColumns);
    });
  });

  describe('lockColumns', () => {
    it('should save lockColumns', () => {
      service.saveLockColumns(true);
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('applications-lock-columns', true);
    });

    it('should restore lockColumns', () => {
      expect(service.restoreLockColumns()).toBe(true);
    });

    it('should restore default lockColumns', () => {
      mockTableService.restoreLockColumns.mockReturnValueOnce(null);
      expect(service.restoreLockColumns()).toBe(defaultConfig.defaultApplications.lockColumns);
    });
  });
});