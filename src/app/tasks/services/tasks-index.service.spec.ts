import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksIndexService } from './tasks-index.service';
import { TaskSummaryListOptions } from '../types';


describe('TasksIndexService', () => {
  let service: TasksIndexService; 

  const expectDefaultOptions :TaskSummaryListOptions = {
    pageIndex: 0,
    pageSize: 100,
    sort: {
      active: 'createdAt',
      direction: 'desc'
    },
  };  
  const expectedDefaultColumns = new DefaultConfigService().defaultTasks.columns;

  const expectedDefaultIntervalValue = new DefaultConfigService().defaultTasks.interval;
  const expectedDefaultLockColumnsValue = new DefaultConfigService().defaultTasks.lockColumns;
  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn(),
    saveLockColumns: jest.fn(),
    restoreLockColumns: jest.fn(),
    saveOptions: jest.fn(),
    restoreOptions: jest.fn(),
    saveColumns: jest.fn(),
    restoreColumns: jest.fn(),
    resetColumns: jest.fn(),
    saveViewInLogs: jest.fn(),
    restoreViewInLogs: jest.fn()
  };


  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        TasksIndexService,
        DefaultConfigService,
        {provide: TableService, useValue: mockTableService}
      ]
    }).inject(TasksIndexService);
  }); 

  test('Create TasksIndexService', ()=> {
    expect(service).toBeTruthy();
  });

  describe('Interval', () => {
    it('should call saveIntervalValue from TableService', ()=>{
      service.saveIntervalValue(9);
      expect(mockTableService.saveIntervalValue).toBeCalledWith('tasks-interval', 9);
    });

    it('should call restoreIntervalValue from TableService', ()=>{
      service.restoreIntervalValue();
      expect(mockTableService.restoreIntervalValue).toHaveBeenCalledWith('tasks-interval');
    });

    it('should return defaultIntervalValue when restoreIntervalValue from TableService returns null', () => {
      mockTableService.restoreIntervalValue.mockImplementationOnce(() => null);
      expect(service.restoreIntervalValue()).toEqual(expectedDefaultIntervalValue);
    });  
  });

  describe('Lock columns', () => {
    it('should call saveLockColumns from TableService', () => {
      service.saveLockColumns(true);
      expect(mockTableService.saveLockColumns).toHaveBeenCalledWith('tasks-lock-columns', true);
    });

    it('should call restoreLockColumns from TableService', () => {
      service.restoreLockColumns();
      expect(mockTableService.restoreLockColumns).toHaveBeenCalledWith('tasks-lock-columns');
    });

    it('should return defaultLockColumn when restoreLockColumns from TableService returns null', () => {
      mockTableService.restoreLockColumns.mockImplementationOnce(() => null);
      expect(service.restoreLockColumns()).toEqual(expectedDefaultLockColumnsValue);
    });  
  });

  describe('Options', ()=>{
    it('should call saveOptions from TableService', ()=>{
      service.saveOptions(expectDefaultOptions);
      expect(mockTableService.saveOptions).toBeCalledWith('tasks-options',expectDefaultOptions);
    });

    it('should call restoreOptions from TableService', ()=>{
      service.restoreOptions(); 
      expect(mockTableService.restoreOptions).toBeCalledWith('tasks-options',expectDefaultOptions);
    });
  });

  describe('Columns', ()=>{
    it('should call saveColumns from TableService', ()=>{
      service.saveColumns(['createdAt', 'actions', 'initialTaskId']); 
      expect(mockTableService.saveColumns).toBeCalledWith('tasks-columns', ['createdAt', 'actions', 'initialTaskId']);
    });

    it('should call restoreColumns from TableService', ()=>{
      service.restoreColumns(); 
      expect(mockTableService.restoreColumns).toBeCalledWith('tasks-columns');
    });

    it('should return defaultColums when restoreColumns from TableService returns null', ()=>{
      mockTableService.restoreColumns.mockImplementationOnce(() => null);
      expect(service.restoreColumns()).toEqual(expectedDefaultColumns);
    });
    
    it('should call resetColumns from TableService', ()=>{
      service.resetColumns(); 
      expect(mockTableService.resetColumns).toBeCalledWith('tasks-columns');
      expect(service.resetColumns()).toEqual(expectedDefaultColumns);
    });
  });

  describe('View in logs', ()=>{
    it('should call saveViewInLongs from TableService', ()=>{
      service.saveViewInLogs('Apple', 'apple', 'https://www.apple.com/fr/');
      expect(mockTableService.saveViewInLogs).toBeCalledWith('tasks-view-in-logs','Apple', 'apple', 'https://www.apple.com/fr/');
    });

    it('should call restoreViewInLogs from TableService', ()=>{
      service.restoreViewInLogs(); 
      expect(mockTableService.restoreViewInLogs).toBeCalledWith('tasks-view-in-logs');
    });
  });
});