import { ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Clipboard } from '@angular/cdk/clipboard';
import { TestBed } from '@angular/core/testing';
import { TableColumn } from '@app/types/column.type';
import { ColumnKey, ResultData } from '@app/types/data';
import { StatusService } from '@app/types/status';
import { NotificationService } from '@services/notification.service';
import { ResultsTableComponent } from './table.component';
import ResultsDataService from '../services/results-data.service';
import { ResultsGrpcService } from '../services/results-grpc.service';
import { ResultRaw } from '../types';

Object.defineProperty(globalThis, 'URL', {
  value: {
    createObjectURL: jest.fn(() => 'mock-url'),
  },
});

type DownloadNext =
  | Uint8Array
  | { dataChunk?: Uint8Array; _dataChunk?: Uint8Array };
type SubscribeNext = (value: DownloadNext) => void;
type SubscribeError = (err: unknown) => void;
type SubscribeComplete = () => void;

describe('ResultsTableComponent', () => {
  let component: ResultsTableComponent;

  const displayedColumns: TableColumn<ResultRaw>[] = [
    {
      name: 'Result ID',
      key: 'resultId',
      type: 'link',
      sortable: true,
      link: '/tasks',
    },
    {
      name: 'Status',
      key: 'status',
      type: 'status',
      sortable: true,
    },
    {
      name: 'Created at',
      key: 'createdAt',
      type: 'date',
      sortable: true,
    },
    {
      name: 'Actions',
      key: 'actions',
      type: 'actions',
      sortable: false,
    }
  ];

  const mockNotificationService = {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
  };

  const mockClipBoard = {
    copy: jest.fn()
  };

  const mockResultsDataService = {
    data: [],
    total: 0,
    loading: false,
    options: {},
    filters: [],
    refresh$: {
      next: jest.fn()
    },
    onDownload: jest.fn(),
  };

  const mockResultsGrpcService = {
    downloadResultData$: jest.fn(),
  };

  const mockStatusService = {
    statuses: {
      [ResultStatus.RESULT_STATUS_ABORTED]: {
        label: 'Aborted',
      },
      [ResultStatus.RESULT_STATUS_COMPLETED]: {
        label: 'Completed'
      },
    },
  };

  beforeEach(() => {
    component = TestBed.configureTestingModule({
      providers: [
        ResultsTableComponent,
        { provide: StatusService, useValue: mockStatusService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Clipboard, useValue: mockClipBoard },
        { provide: ResultsDataService, useValue: mockResultsDataService },
        { provide: ResultsGrpcService, useValue: mockResultsGrpcService },
      ],
    }).inject(ResultsTableComponent);

    component.displayedColumns = displayedColumns;
    component.ngOnInit();
    jest.clearAllMocks();

    mockResultsGrpcService.downloadResultData$.mockReturnValue({
      subscribe: ({
        next,
        complete,
      }: {
        next: SubscribeNext;
        complete: SubscribeComplete;
      }) => {
        next(new Uint8Array([1, 2, 3]));
        complete();
      },
    });
  });

  it('should run', () => {
    expect(component).toBeTruthy();
  });

  describe('options changes', () => {
    it('should refresh data', () => {
      const spy = jest.spyOn(component.optionsUpdate, 'emit');
      component.onOptionsChange();
      expect(spy).toHaveBeenCalled();
    });
  });

  test('onDrop should call ResultsIndexService', () => {
    const newColumns: ColumnKey<ResultRaw>[] = ['actions', 'resultId', 'status'];
    const spy = jest.spyOn(component.columnUpdate, 'emit');
    component.onDrop(newColumns);
    expect(spy).toHaveBeenCalledWith(newColumns);
  });

  describe('isDataRawEqual', () => {
    it('should return true if two resultRaws are the same', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = {...result1} as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeTruthy();
    });

    it('should return false if two resultRaws are differents', () => {
      const result1 = { resultId: 'result' } as ResultRaw;
      const result2 = { resultId: 'result1' } as ResultRaw;
      expect(component.isDataRawEqual(result1, result2)).toBeFalsy();
    });
  });

  it('should track a result by its id', () => {
    const result = {raw: { resultId: 'result' }} as ResultData;
    expect(component.trackBy(0, result)).toEqual(result.raw.resultId);
  });

  it('should get data', () => {
    expect(component.data).toEqual(mockResultsDataService.data);
  });

  it('should get total', () => {
    expect(component.total).toEqual(mockResultsDataService.total);
  });

  it('should get options', () => {
    expect(component.options).toEqual(mockResultsDataService.options);
  });

  it('should get filters', () => {
    expect(component.filters).toEqual(mockResultsDataService.filters);
  });

  it('should get column keys', () => {
    expect(component.columnKeys).toEqual(displayedColumns.map((c) => c.key));
  });

  it('should get displayedColumns', () => {
    expect(component.columns).toEqual(displayedColumns);
  });

  it('should call grpc download with the correct resultId', async () => {
    const resultId = 'test-result-id';
    await component.onDownload(resultId);
    expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledTimes(1);
    expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledWith(resultId);
  });

  it('should notify user when grpc download emits an error', async () => {
    mockResultsGrpcService.downloadResultData$.mockReturnValue({
      subscribe: ({ error }: { error: SubscribeError }) => {
        error(new Error('Simulated gRPC error'));
      },
    });
    await component.onDownload('result-err');
    expect(mockResultsGrpcService.downloadResultData$).toHaveBeenCalledWith('result-err');
    expect(mockNotificationService.warning).toHaveBeenCalledWith('Result Not Found');
  });
});
