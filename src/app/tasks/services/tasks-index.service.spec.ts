import { mock } from 'node:test';
import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksIndexService } from './tasks-index.service';
import { TaskSummaryColumnKey, TaskSummaryListOptions } from '../types';


describe('TasksIndexService', () => {
  let service: TasksIndexService; 

  const mockColumnLabels: Record<TaskSummaryColumnKey, string> = {
    id: 'Task ID',
    status: 'Status',
    createdAt: 'Created at',
    actions:'Actions',
    'options.applicationName':'Options Application Name',
    'options.applicationNamespace': 'Options Application Namespace',
    'options.applicationService': 'Options Application Service',
    'options.applicationVersion': 'Options Application Version',
    'options.engineType': 'Options Engine Type',
    'options.maxDuration': 'Options Max Duration',
    'options.maxRetries': 'Options Max Retries',
    'options.partitionId':'Options Partition ID',
    'options.priority': 'Options Priority',
    'options.options': 'Options Options',
    sessionId: 'Session ID',
    acquiredAt: 'Acquired at',
    endedAt: 'Ended at',
    initialTaskId: 'Initial Task ID',
    ownerPodId: 'Owner Pod ID',
    podHostname: 'Pod Hostname',
    podTtl: 'Pod TTL',
    receivedAt: 'Received at',
    startedAt: 'Started at',
    statusMessage: 'Status Message',
    submittedAt:'Submitted at',
    creationToEndDuration: 'Creation to End Duration',
    processingToEndDuration: 'Processing to End Duration',
    options: 'Options',
    countDataDependencies: 'Count Data Dependencies',
    countExpectedOutputIds: 'Count Expected Output IDs',
    countParentTaskIds: 'Count Parent Task IDs',
    countRetryOfIds: 'Count Retry Of IDs',
    error: 'Error',
    select: 'Select',
  };

  const mockAvailableColumns =  [
    'id', 'acquiredAt', 'actions', 'createdAt', 'creationToEndDuration', 'endedAt','initialTaskId', 'options', 'options.applicationName', 'options.maxDuration', 'options.applicationNamespace', 'options.applicationService', 'options.applicationVersion', 'options.engineType', 'options.maxRetries', 'options.partitionId', 'options.priority', 'ownerPodId', 'podHostname', 'podTtl', 'processingToEndDuration', 'receivedAt', 'sessionId', 'startedAt', 'status', 'statusMessage', 'submittedAt', 'countDataDependencies', 'countExpectedOutputIds', 'countParentTaskIds', 'countRetryOfIds', 'select'
  ];
  const mockDateColumns = ['acquiredAt', 'createdAt', 'endedAt', 'receivedAt', 'startedAt', 'submittedAt'];
  const mockDurationColums = ['creationToEndDuration', 'processingToEndDuration', 'options.maxDuration'];
  const mockObjectColumns = ['options', 'options.options'];
  const mockDefaultOptions :TaskSummaryListOptions = {
    pageIndex: 0,
    pageSize: 10,
    sort: {
      active: 'id',
      direction: 'asc'
    },
  };  
  const mockDefaultViewInLogs = {
    serviceName: null, 
    serviceIcon: null, 
    urlTemplate: null,
  };
  const mockDefaultIntervalValue = new DefaultConfigService().defaultTasks.interval;
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
        TasksIndexService,
        DefaultConfigService,
        {provide: TableService, useValue: mockTableService}
      ]
    }).inject(TasksIndexService);
  }); 

  test('Create TasksIndexService', ()=> {
    expect(service).toBeTruthy();
  });
 

  describe('Columns', ()=> {
    test('the service should label the right column among available columns labels',() => { 
      for(const [key] of Object.entries(mockColumnLabels)) {
        expect(service.columnToLabel(key as TaskSummaryColumnKey)).toEqual(service.columnsLabels[`${key}` as TaskSummaryColumnKey]);
      }
    });
  });

  describe('Table', () => {
    it('should return true if the column is actions', () =>{
      expect(service.isActionsColumn('actions')).toBe(true);
    });
    it('should return false if the column is not actions', () =>{
      expect(service.isActionsColumn('id')).toBe(false);
    }); 

    it('should return true if the column is id', () =>{
      expect(service.isTaskIdColumn('id')).toBe(true);
    });
    it('should return false if the column is not id', () =>{
      expect(service.isTaskIdColumn('status')).toBe(false);
    });

    it('should return true if the column is status', () =>{
      expect(service.isStatusColumn('status')).toBe(true);
    });
    it('should return false if the column is not status', () =>{
      expect(service.isStatusColumn('actions')).toBe(false);
    }); 
    
    it('should return true if the column is in dateColumns array', () =>{
      expect(service.isDateColumn('createdAt')).toBe(true);
    }); 
    it('should return false if the column is not in dateColumns array', () =>{
      expect(service.isDateColumn('actions')).toBe(false);
    });
    
    it('should return true if the column is in durationColumn array', () =>{
      expect(service.isDurationColumn('processingToEndDuration')).toBe(true);
    });
    it('should return false if the column is not in durationColumn array', () =>{
      expect(service.isDurationColumn('createdAt')).toBe(false);
    });

    it('should return true if the column is in objectColumn array', () =>{
      expect(service.isObjectColumn('options')).toBe(true);
    });
    it('should return false if the column is not in objectColumn array', () =>{
      expect(service.isObjectColumn('createdAt')).toBe(false);
    });

    it('should return true if the column is select', () =>{
      expect(service.isSelectColumn('select')).toBe(true);
    });
    it('should return false if the column is not select', () =>{
      expect(service.isSelectColumn('actions')).toBe(false);
    });

    it('should return true if the column is a simple column', () =>{
      expect(service.isSimpleColumn('sessionId')).toBe(true);
    });
    it('should return false if the column is not a simple column', () =>{
      expect(service.isSimpleColumn('createdAt')).toBe(false);
      expect(service.isSimpleColumn('creationToEndDuration')).toBe(false);
      expect(service.isSimpleColumn('options')).toBe(false);
      expect(service.isSimpleColumn('id')).toBe(false);
      expect(service.isSimpleColumn('status')).toBe(false);
    });
    
    it('should return true if the column is not sortable', () =>{
      expect(service.isNotSortableColumn('select')).toBe(true);
      expect(service.isNotSortableColumn('actions')).toBe(true);
      expect(service.isNotSortableColumn('options')).toBe(true);
    });
    it('should return false if the column is sortable', () =>{
      expect(service.isNotSortableColumn('id')).toBe(false);
    });
  });

  describe('Interval', ()=>{
    it('should call saveIntervalValue from TableService', ()=>{
      service.saveIntervalValue(9);
      expect(mockTableService.saveIntervalValue).toBeCalledWith('tasks-interval', 9);
    });

    it('should call restoreIntervalValue from TableService', ()=>{
      service.restoreIntervalValue();
      expect(mockTableService.restoreIntervalValue).toHaveBeenCalledWith('tasks-interval');
      mockTableService.restoreIntervalValue.mockImplementationOnce(() => null);
      expect(service.restoreIntervalValue()).toEqual(mockDefaultIntervalValue);
    });
    
  });

  describe('Options', ()=>{
    it('should call saveOptions from TableService', ()=>{
      service.saveOptions(mockDefaultOptions);
      expect(mockTableService.saveOptions).toBeCalledWith('tasks-options',mockDefaultOptions);
    });

    it('should call restoreOptions from TableService', ()=>{
      service.restoreOptions(); 
      expect(mockTableService.restoreOptions).toBeCalledWith('tasks-options',mockDefaultOptions);
    });
  });
});