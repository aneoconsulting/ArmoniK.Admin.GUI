import {
  FilterArrayOperator,
  FilterDateOperator,
  FilterNumberOperator,
  FilterStatusOperator,
  FilterStringOperator,
  GetResultRequest,
  ListResultsRequest,
  ResultRawEnumField,
  ResultStatus,
  ResultsClient,
  DownloadResultDataRequest,
} from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { ListOptionsSort } from '@app/types/options';
import { UtilsService } from '@services/utils.service';
import { of, throwError } from 'rxjs';
import { ResultsFiltersService } from './results-filters.service';
import { ResultsGrpcService } from './results-grpc.service';
import { ResultRaw, ResultRawFilters, ResultRawListOptions } from '../types';
 
describe('ResultsGrpcService', () => {
  let service: ResultsGrpcService;

  const filters: ResultRawFilters = [
    [
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
        for: 'root',
        operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        value: 'resultId',
      },
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
        for: 'root',
        operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
        value: '12323981203',
      },
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
        for: 'root',
        operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL,
        value: ResultStatus.RESULT_STATUS_DELETED,
      },
    ],
    [
      {
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN,
        value: 100,
      },
      {
        field: null,
        for: 'root',
        operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN_OR_EQUAL,
        value: 29,
      },
    ],
  ];
 
  const options: ResultRawListOptions = {
    pageIndex: 2,
    pageSize: 10,
    sort: {
      active: 'resultId',
      direction: 'asc',
    },
  };
 
  const mockResultsFiltersService = {
    filtersDefinitions: [
      { for: 'root', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID, type: 'string' },
      {
        for: 'root',
        field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
        type: 'status',
        statuses: [
          { key: ResultStatus.RESULT_STATUS_COMPLETED, value: 'Completed' },
          { key: ResultStatus.RESULT_STATUS_CREATED, value: 'Created' },
        ],
      },
      { for: 'root', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT, type: 'date' },
      { for: 'root', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE, type: 'number' },
      { for: 'root', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID, type: 'array' },
    ],
  };

  const mockResultsClient = {
    listResults: jest.fn(),
    getResult: jest.fn(),
    downloadResultData: jest.fn(),
  };
 
  beforeEach(() => {
    jest.clearAllMocks();
 
    service = TestBed.configureTestingModule({
      providers: [
        ResultsGrpcService,
        UtilsService,
        { provide: ResultsFiltersService, useValue: mockResultsFiltersService },
        { provide: ResultsClient, useValue: mockResultsClient },
      ],
    }).inject(ResultsGrpcService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should list results', () => {
    service.list$(options, filters);
    expect(mockResultsClient.listResults).toHaveBeenCalledWith(
      new ListResultsRequest({
        page: options.pageIndex,
        pageSize: options.pageSize,
        sort: {
          direction: 1,
          field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID } },
        },
        filters: {
          or: [
            {
              and: [
                {
                  field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID } },
                  filterString: {
                    operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
                    value: 'resultId',
                  },
                },
                {
                  field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT } },
                  filterDate: {
                    operator: FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
                    value: { nanos: 0, seconds: '12323981203' },
                  },
                },
                {
                  field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS } },
                  filterStatus: {
                    operator: FilterStatusOperator.FILTER_STATUS_OPERATOR_NOT_EQUAL,
                    value: ResultStatus.RESULT_STATUS_DELETED,
                  },
                },
              ],
            },
            {
              and: [
                {
                  field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE } },
                  filterNumber: {
                    operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN,
                    value: '100',
                  },
                },
              ],
            },
          ],
        },
      }),
    );
  });
 
  it('should have a default sort field', () => {
    const options: ResultRawListOptions = {
      pageIndex: 2,
      pageSize: 10,
      sort: { active: null, direction: 'asc' } as unknown as ListOptionsSort<ResultRaw>,
    };
    service.list$(options, []);
    expect(mockResultsClient.listResults).toHaveBeenCalledWith(
      new ListResultsRequest({
        page: options.pageIndex,
        pageSize: options.pageSize,
        sort: {
          direction: 1,
          field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID } },
        },
        filters: {},
      }),
    );
  });
 
   it('should throw an error if the filter type is not supported', () => {
    const filter: ResultRawFilters = [
      [
        {
          field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID,
          for: 'root',
          operator: FilterArrayOperator.FILTER_ARRAY_OPERATOR_NOT_CONTAINS,
          value: 'task',
        },
      ],
    ];
    expect(() => service.list$(options, filter)).toThrow('Type array not supported');
  });

  it('should get a result', () => {
    const resultId = 'resultId';
    service.get$(resultId);
    expect(mockResultsClient.getResult).toHaveBeenCalledWith(new GetResultRequest({ resultId }));
  });
 
  describe('downloadResultData$', () => {
    it('should call downloadResultData with the correct request', (done) => {
      const resultId = 'result-123';
      mockResultsClient.downloadResultData.mockReturnValueOnce(of(void 0));
 
      service.downloadResultData$(resultId).subscribe({
        complete: () => {
          try {
            expect(mockResultsClient.downloadResultData).toHaveBeenCalledTimes(1);
 
            const arg = mockResultsClient.downloadResultData.mock.calls[0][0] as DownloadResultDataRequest;
            expect(arg).toBeInstanceOf(DownloadResultDataRequest);
            expect(arg.resultId).toBe(resultId);

            done();
          } catch (e) {
            done(e);
          }
        },
      });
    });
 
    it('should propagate error from downloadResultData', (done) => {
      const resultId = 'result-err';
      const err = new Error('boom');
      mockResultsClient.downloadResultData.mockReturnValueOnce(throwError(() => err));
 
      service.downloadResultData$(resultId).subscribe({
        next: () => done('should not emit next on error'),
        error: (e) => {
          try {
            expect(e).toBe(err);
 
            const arg = mockResultsClient.downloadResultData.mock.calls[0][0] as DownloadResultDataRequest;
            expect(arg.resultId).toBe(resultId);
 
            done();
          } catch (assertErr) {
            done(assertErr);
          }
        },
      });
    });
  });
});