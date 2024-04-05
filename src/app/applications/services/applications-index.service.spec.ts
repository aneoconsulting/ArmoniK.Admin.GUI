import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationsIndexService } from './applications-index.service';
import { ApplicationRawListOptions } from '../types';


describe('TasksIndexService', () => {
  let service: ApplicationsIndexService; 

  const expectDefaultOptions :ApplicationRawListOptions = {
    pageIndex: 0,
    pageSize: 100,
    sort: {
      active: 'name',
      direction: 'asc'
    },
  };  
  const expectedDefaultColumns = new DefaultConfigService().defaultApplications.columns;

  const expectedDefaultIntervalValue = new DefaultConfigService().defaultApplications.interval;
  const mockTableService = {
    saveIntervalValue: jest.fn(),
    restoreIntervalValue: jest.fn(),
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
      mockTableService.restoreIntervalValue.mockImplementationOnce(() => null);
      expect(service.restoreIntervalValue()).toEqual(expectedDefaultIntervalValue);
    });  

  });

  describe('Options', ()=>{
    it('should call saveOptions from TableService', ()=>{
      service.saveOptions(expectDefaultOptions);
      expect(mockTableService.saveOptions).toBeCalledWith('applications-options',expectDefaultOptions);
    });

    it('should call restoreOptions from TableService', ()=>{
      service.restoreOptions(); 
      expect(mockTableService.restoreOptions).toBeCalledWith('applications-options',expectDefaultOptions);
    });
  });

  describe('Columns', ()=>{
    it('should call saveColumns from TableService', ()=>{
      service.saveColumns(['namespace', 'actions', 'version']); 
      expect(mockTableService.saveColumns).toBeCalledWith('applications-columns', ['namespace', 'actions', 'version']);
    });

    it('should call restoreColumns from TableService', ()=>{
      service.restoreColumns(); 
      expect(mockTableService.restoreColumns).toBeCalledWith('applications-columns');
    });

    it('should return defaultColums when restoreColumns from TableService returns null', ()=>{
      mockTableService.restoreColumns.mockImplementationOnce(() => null);
      expect(service.restoreColumns()).toEqual(expectedDefaultColumns);
    });

    it('should call resetColumns from TableService', ()=>{
      service.resetColumns(); 
      expect(mockTableService.resetColumns).toBeCalledWith('applications-columns');
      expect(service.resetColumns()).toEqual(expectedDefaultColumns);
    });
  });
});