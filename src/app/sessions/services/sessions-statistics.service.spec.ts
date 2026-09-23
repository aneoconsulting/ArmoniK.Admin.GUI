import { FilterDateOperator, FilterDurationOperator, FilterNumberOperator, ListResultsRequest, ListResultsResponse, ListTasksRequest, ListTasksResponse, ResultRawEnumField, ResultsClient, SortDirection, TaskSummaryEnumField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { TestBed } from '@angular/core/testing';
import { HistogramData } from '@app/types/statistics';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { ByteArrayService } from '@services/byte-array.service';
import { Observable, of, throwError } from 'rxjs';
import { SessionsStatisticsService, computeBoundaries, toRanges, toSecondsValue } from './sessions-statistics.service';

describe('computeBoundaries', () => {
  it('should split a range into the requested number of buckets', () => {
    expect(computeBoundaries(0, 100, 10)).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
  });

  it('should keep fractional boundaries when minWidth is 0', () => {
    expect(computeBoundaries(0, 1, 4)).toEqual([0, 0.25, 0.5, 0.75, 1]);
  });

  it('should return a single bucket when min equals max', () => {
    expect(computeBoundaries(5, 5, 20, 1)).toEqual([5, 6]);
  });

  it('should return a single bucket when max is lower than min', () => {
    expect(computeBoundaries(10, 5, 20, 1)).toEqual([10, 11]);
  });

  it('should reduce the bucket count rather than emit degenerate buckets', () => {
    expect(computeBoundaries(0, 5, 20, 1)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('should return whole boundaries when minWidth is set', () => {
    expect(computeBoundaries(0, 7, 3, 1).every(Number.isInteger)).toBe(true);
  });
});

describe('toRanges', () => {
  it('should flag the last range only', () => {
    expect(toRanges([0, 1, 2])).toEqual([
      { lower: 0, upper: 1, isFirst: true, isLast: false },
      { lower: 1, upper: 2, isFirst: false, isLast: true },
    ]);
  });
});

describe('toSecondsValue', () => {
  it('should return 0 when the value is missing', () => {
    expect(toSecondsValue(undefined)).toBe(0);
  });

  it('should include the sub second part of a duration', () => {
    expect(toSecondsValue(new Duration({ seconds: '1', nanos: 500000000 }))).toBe(1.5);
  });

  it('should include the sub second part of a timestamp', () => {
    expect(toSecondsValue(new Timestamp({ seconds: '1789976522', nanos: 188000000 }))).toBe(1789976522.188);
  });
});

describe('SessionsStatisticsService', () => {
  let service: SessionsStatisticsService;

  const mockTasksClient = { listTasks: jest.fn() };
  const mockResultsClient = { listResults: jest.fn() };

  const sessionId = 'sessionId';

  const taskBounds = (min: number, max: number, total: number) => {
    mockTasksClient.listTasks
      .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: min.toString(), nanos: 0 }, creationToEndDuration: { seconds: min.toString(), nanos: 0 } }], total } as unknown as ListTasksResponse))
      .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: max.toString(), nanos: 0 }, creationToEndDuration: { seconds: max.toString(), nanos: 0 } }], total } as unknown as ListTasksResponse));
  };

  const taskCounts = (count: number) => {
    mockTasksClient.listTasks.mockReturnValue(of({ tasks: [], total: count } as unknown as ListTasksResponse));
  };

  const taskRequests = () => mockTasksClient.listTasks.mock.calls.map(call => call[0] as ListTasksRequest);
  const resultRequests = () => mockResultsClient.listResults.mock.calls.map(call => call[0] as ListResultsRequest);

  beforeEach(() => {
    service = TestBed.configureTestingModule({
      providers: [
        SessionsStatisticsService,
        ByteArrayService,
        { provide: TasksClient, useValue: mockTasksClient },
        { provide: ResultsClient, useValue: mockResultsClient },
      ]
    }).inject(SessionsStatisticsService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  describe('taskDateHistogram$', () => {
    const option = { label: 'Created at', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT, property: 'createdAt' as const };

    const compute = (buckets: number): Observable<unknown> => service.taskDateHistogram$(sessionId, option, buckets);

    it('should describe each bucket as a range', async () => {
      taskBounds(0, 100, 42);
      taskCounts(1);

      const data = await new Promise<HistogramData>(resolve => compute(2).subscribe(resolve as (value: unknown) => void));

      // N buckets, N+1 edges: the edges are what the axis draws, between the bars.
      expect(data.boundaries).toHaveLength(3);
      expect(data.boundaryLabels).toHaveLength(3);
      expect(data.intervals).toHaveLength(2);
      expect(data.intervals[0]).toEqual(`${data.boundaryLabels[0]} → ${data.boundaryLabels[1]}`);
      expect(data.intervals[1]).toEqual(`${data.boundaryLabels[1]} → ${data.boundaryLabels[2]}`);
    });

    it('should return one count per bucket', async () => {
      taskBounds(0, 100, 42);
      taskCounts(7);

      const data = await new Promise(resolve => compute(10).subscribe(resolve));

      expect(data).toEqual({
        boundaries: expect.any(Array),
        boundaryLabels: expect.any(Array),
        intervals: expect.any(Array),
        counts: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
        total: 42,
      });
    });

    it('should read the bounds with one row, sorted ascending then descending', async () => {
      taskBounds(0, 100, 42);
      taskCounts(1);

      await new Promise(resolve => compute(2).subscribe(resolve));

      const [ascending, descending] = taskRequests();
      expect(ascending.pageSize).toBe(1);
      expect(ascending.sort?.direction).toBe(SortDirection.SORT_DIRECTION_ASC);
      expect(ascending.sort?.field?.taskSummaryField?.field).toBe(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT);
      expect(descending.pageSize).toBe(1);
      expect(descending.sort?.direction).toBe(SortDirection.SORT_DIRECTION_DESC);
    });

    it('should count buckets without retrieving any task', async () => {
      taskBounds(0, 100, 42);
      taskCounts(1);

      await new Promise(resolve => compute(2).subscribe(resolve));

      expect(taskRequests().slice(2).every(request => request.pageSize === 0)).toBe(true);
    });

    it('should leave the outer buckets open ended', async () => {
      taskBounds(0, 100, 42);
      taskCounts(1);

      await new Promise(resolve => compute(2).subscribe(resolve));

      const [first, last] = taskRequests().slice(2).map(request => request.filters?.or?.[0].and ?? []);

      // The first bucket carries the "is set" guard instead of a lower boundary.
      expect(first.map(entry => entry.filterDate?.operator)).toEqual([
        undefined,
        FilterDateOperator.FILTER_DATE_OPERATOR_AFTER,
        FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE,
      ]);

      // The last one has no upper boundary at all.
      expect(last.map(entry => entry.filterDate?.operator)).toEqual([
        undefined,
        FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL,
      ]);
    });

    it('should keep the sub second part of the bounds', async () => {
      mockTasksClient.listTasks
        .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: '10', nanos: 500000000 } }], total: 4 } as unknown as ListTasksResponse))
        .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: '11', nanos: 500000000 } }], total: 4 } as unknown as ListTasksResponse));
      taskCounts(1);

      await new Promise(resolve => compute(2).subscribe(resolve));

      // Boundaries are 10.5 / 11 / 11.5, so the single inner boundary lands on a whole second.
      const inner = taskRequests().slice(2).map(request => request.filters?.or?.[0].and?.at(-1)?.filterDate?.value);
      expect(inner[0]).toEqual(expect.objectContaining({ seconds: '11', nanos: 0 }));
      expect(inner[1]).toEqual(expect.objectContaining({ seconds: '11', nanos: 0 }));
    });

    it('should not bin a field the server does not report, but keep its total', async () => {
      taskBounds(0, 0, 12);

      const data = await new Promise(resolve => compute(20).subscribe(resolve));

      expect(data).toEqual({ boundaries: [], boundaryLabels: [], intervals: [], counts: [], total: 12 });
      expect(taskRequests()).toHaveLength(2);
    });

    it('should not issue a count request for a lone bucket', async () => {
      mockTasksClient.listTasks
        .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: '10', nanos: 0 } }], total: 6 } as unknown as ListTasksResponse))
        .mockReturnValueOnce(of({ tasks: [{ createdAt: { seconds: '10', nanos: 0 } }], total: 6 } as unknown as ListTasksResponse));

      const data = await new Promise<HistogramData>(resolve => compute(20).subscribe(resolve as (value: unknown) => void));

      // The bounds requests already answered it: their filter set is the lone bucket's.
      expect(data.counts).toEqual([6]);
      expect(data.total).toBe(6);
      expect(taskRequests()).toHaveLength(2);
    });

    it('should filter on the session of every request', async () => {
      taskBounds(0, 100, 42);
      taskCounts(1);

      await new Promise(resolve => compute(2).subscribe(resolve));

      expect(taskRequests().every(request => request.filters?.or?.[0].and?.[0].filterString?.value === sessionId)).toBe(true);
    });

    it('should not count anything when the session has no task', async () => {
      taskBounds(0, 0, 0);

      const data = await new Promise(resolve => compute(20).subscribe(resolve));

      expect(data).toEqual({ boundaries: [], boundaryLabels: [], intervals: [], counts: [], total: 0 });
      expect(taskRequests()).toHaveLength(2);
    });

    it('should propagate errors', async () => {
      mockTasksClient.listTasks.mockReturnValue(throwError(() => new Error('Unreachable')));

      await expect(new Promise((resolve, reject) => compute(20).subscribe({ next: resolve, error: reject })))
        .rejects.toThrow('Unreachable');
    });
  });

  describe('taskDurationHistogram$', () => {
    const option = { label: 'Creation to end', field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATION_TO_END_DURATION, property: 'creationToEndDuration' as const };

    it('should keep sub second boundaries', async () => {
      mockTasksClient.listTasks
        .mockReturnValueOnce(of({ tasks: [{ creationToEndDuration: { seconds: '0', nanos: 0 } }], total: 10 } as unknown as ListTasksResponse))
        .mockReturnValueOnce(of({ tasks: [{ creationToEndDuration: { seconds: '1', nanos: 0 } }], total: 10 } as unknown as ListTasksResponse));
      taskCounts(1);

      await new Promise(resolve => service.taskDurationHistogram$(sessionId, option, 2).subscribe(resolve));

      // Boundaries are 0 / 0.5 / 1, and only the inner one is ever sent.
      const inner = taskRequests().slice(2).map(request => request.filters?.or?.[0].and?.at(-1)?.filterDuration?.value);
      expect(inner[0]).toEqual(expect.objectContaining({ seconds: '0', nanos: 500000000 }));
      expect(inner[1]).toEqual(expect.objectContaining({ seconds: '0', nanos: 500000000 }));
    });

    it('should leave the outer buckets open ended', async () => {
      mockTasksClient.listTasks
        .mockReturnValueOnce(of({ tasks: [{ creationToEndDuration: { seconds: '0', nanos: 100000000 } }], total: 10 } as unknown as ListTasksResponse))
        .mockReturnValueOnce(of({ tasks: [{ creationToEndDuration: { seconds: '1', nanos: 0 } }], total: 10 } as unknown as ListTasksResponse));
      taskCounts(1);

      await new Promise(resolve => service.taskDurationHistogram$(sessionId, option, 2).subscribe(resolve));

      const [first, last] = taskRequests().slice(2).map(request => request.filters?.or?.[0].and ?? []);

      expect(first.map(entry => entry.filterDuration?.operator)).toEqual([
        undefined,
        FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN,
        FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN,
      ]);

      expect(last.map(entry => entry.filterDuration?.operator)).toEqual([
        undefined,
        FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL,
      ]);
    });
  });

  describe('resultSizeHistogram$', () => {
    it('should count results by size without retrieving any result', async () => {
      mockResultsClient.listResults
        .mockReturnValueOnce(of({ results: [{ size: '0' }], total: 8 } as unknown as ListResultsResponse))
        .mockReturnValueOnce(of({ results: [{ size: '1000' }], total: 8 } as unknown as ListResultsResponse))
        .mockReturnValue(of({ results: [], total: 4 } as unknown as ListResultsResponse));

      const data = await new Promise(resolve => service.resultSizeHistogram$(sessionId, 2).subscribe(resolve));

      expect(data).toEqual({ boundaries: expect.any(Array), boundaryLabels: expect.any(Array), intervals: expect.any(Array), counts: [4, 4], total: 8 });
      expect(resultRequests().slice(2).every(request => request.pageSize === 0)).toBe(true);
      expect(resultRequests()[2].filters?.or?.[0].and?.[1].filterNumber?.operator).toBe(FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN);
      expect(resultRequests()[3].filters?.or?.[0].and?.[1].filterNumber?.operator).toBe(FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL);
      expect(resultRequests()[3].filters?.or?.[0].and).toHaveLength(2);
    });
  });

  describe('resultDateHistogram$', () => {
    it('should support the completedAt field', async () => {
      mockResultsClient.listResults
        .mockReturnValueOnce(of({ results: [{ completedAt: { seconds: '0', nanos: 0 } }], total: 3 } as unknown as ListResultsResponse))
        .mockReturnValueOnce(of({ results: [{ completedAt: { seconds: '10', nanos: 0 } }], total: 3 } as unknown as ListResultsResponse))
        .mockReturnValue(of({ results: [], total: 1 } as unknown as ListResultsResponse));

      const option = { label: 'Completed at', field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT, property: 'completedAt' as const };
      const data = await new Promise(resolve => service.resultDateHistogram$(sessionId, option, 2).subscribe(resolve));

      expect(data).toEqual({ boundaries: expect.any(Array), boundaryLabels: expect.any(Array), intervals: expect.any(Array), counts: [1, 1], total: 3 });
      expect(resultRequests()[0].sort?.field?.resultRawField?.field).toBe(ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT);
    });
  });
});
