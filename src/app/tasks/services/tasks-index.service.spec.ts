import { TestBed } from '@angular/core/testing';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksIndexService } from './tasks-index.service';
import { TaskSummaryColumnKey } from '../types';


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
  const mockDefaultOptions = {
    defaultTasks: {
      options: {
        pageIndex: 0,
        pageSize: 10,
        sort: {
          active: 'id',
          direction: 'asc'
        },
      }
    }
  };

  const mockDefaultIntervalValue = 5; 
  const mockDefaultViewInLogs = {
    serviceName: null, 
    serviceIcon: null, 
    urlTemplate: null,
  };

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
    test('columnToLabels',() => { 
      for(const [key] of Object.entries(mockColumnLabels)) {
        expect(service.columnToLabel(key as TaskSummaryColumnKey)).toEqual(service.columnsLabels[`${key}` as TaskSummaryColumnKey]);
      }
    
    });
  });
});