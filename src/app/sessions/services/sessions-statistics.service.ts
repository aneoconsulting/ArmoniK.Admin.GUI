import { FilterDateOperator, FilterDurationOperator, FilterNumberOperator, FilterStringOperator, ListResultsRequest, ListTasksRequest, ResultFilterField, ResultRaw, ResultRawEnumField, ResultsClient, SortDirection, TaskFilterField, TaskSummary, TaskSummaryEnumField, TasksClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Filter } from '@app/types/filters';
import { BucketRange, HistogramData, HistogramField, ResultDateProperty, TaskDateProperty, TaskDurationProperty } from '@app/types/statistics';
import { Duration, Timestamp } from '@ngx-grpc/well-known-types';
import { DurationPipe } from '@pipes/duration.pipe';
import { ByteArrayService } from '@services/byte-array.service';
import { FilterField, buildDurationFilter, buildNumberFilter, buildStringFilter, toProtobufSeconds } from '@services/grpc-build-request.service';
import { Observable, forkJoin, from, map, mergeMap, of, switchMap, toArray } from 'rxjs';

/**
 * Bucket requests are fired in parallel. Lower this if a deployment sits behind a rate limiter.
 */
const MAX_CONCURRENT_HISTOGRAM_REQUESTS = 4;

type Bounds = {
  min: number;
  max: number;
  total: number;
};

/**
 * Splits [min, max] into at most `requested` buckets and returns their boundaries.
 *
 * `minWidth` above 0 means the boundaries must be whole numbers at least that far apart: date and
 * size filters are serialised as integers, so fractional boundaries would produce invalid requests.
 * The bucket count is reduced rather than emitting degenerate empty buckets.
 */
export function computeBoundaries(min: number, max: number, requested: number, minWidth = 0): number[] {
  const rounded = minWidth > 0;
  const lower = rounded ? Math.floor(min) : min;
  const upper = rounded ? Math.ceil(max) : max;

  if (upper <= lower) {
    return [lower, lower + (minWidth || 1)];
  }

  let count = requested;
  if (rounded && (upper - lower) / count < minWidth) {
    count = Math.max(1, Math.floor((upper - lower) / minWidth));
  }

  const width = (upper - lower) / count;
  const boundaries: number[] = [];

  for (let index = 0; index <= count; index++) {
    const value = index === count ? upper : lower + (index * width);
    const boundary = rounded ? Math.round(value) : value;

    if (boundaries[boundaries.length - 1] !== boundary) {
      boundaries.push(boundary);
    }
  }

  return boundaries;
}

export function toRanges(boundaries: number[]): BucketRange[] {
  return boundaries.slice(0, -1).map((lower, index) => ({
    lower,
    upper: boundaries[index + 1],
    isFirst: index === 0,
    isLast: index === boundaries.length - 2,
  }));
}

/**
 * A protobuf duration or timestamp as a number of seconds, sub second part included. Dropping the
 * sub second part here would leave the tail of a histogram outside of its last bucket.
 */
export function toSecondsValue(value: Duration | Timestamp | undefined): number {
  if (!value) {
    return 0;
  }

  return Number(value.seconds ?? 0) + ((value.nanos ?? 0) / 1e9);
}

/**
 * Computes the histograms of a session without ever listing its tasks or results: every bar is a
 * request filtered on the bucket range with `pageSize: 0`, of which only `total` is read.
 */
@Injectable()
export class SessionsStatisticsService {
  private readonly tasksClient = inject(TasksClient);
  private readonly resultsClient = inject(ResultsClient);
  private readonly byteArrayService = inject(ByteArrayService);
  private readonly durationPipe = new DurationPipe();

  readonly taskDateFields: HistogramField<TaskDateProperty>[] = [
    { label: $localize`Created at`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT, property: 'createdAt' },
    { label: $localize`Submitted at`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SUBMITTED_AT, property: 'submittedAt' },
    { label: $localize`Started at`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT, property: 'startedAt' },
    { label: $localize`Ended at`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT, property: 'endedAt' },
  ];

  readonly taskDurationFields: HistogramField<TaskDurationProperty>[] = [
    { label: $localize`Creation to end`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATION_TO_END_DURATION, property: 'creationToEndDuration' },
    { label: $localize`Processing to end`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PROCESSING_TO_END_DURATION, property: 'processingToEndDuration' },
    { label: $localize`Received to end`, field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_RECEIVED_TO_END_DURATION, property: 'receivedToEndDuration' },
  ];

  readonly resultDateFields: HistogramField<ResultDateProperty>[] = [
    { label: $localize`Created at`, field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT, property: 'createdAt' },
    { label: $localize`Completed at`, field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT, property: 'completedAt' },
  ];

  taskDateHistogram$(sessionId: string, option: HistogramField<TaskDateProperty>, buckets: number): Observable<HistogramData> {
    const filterField = this.taskField(option.field);
    const isSet = this.dateFilter(filterField, 0, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER) as TaskFilterField.AsObject;

    return this.taskBounds$(sessionId, option.field, [isSet], task => toSecondsValue(task[option.property])).pipe(
      switchMap(bounds => this.histogram$(
        bounds,
        buckets,
        0,
        range => this.countTasks$(sessionId, this.bucketFilters(range, [isSet],
          () => this.dateFilter(filterField, range.lower, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL) as TaskFilterField.AsObject,
          () => this.dateFilter(filterField, range.upper, FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE) as TaskFilterField.AsObject,
        )),
        (value, width) => this.dateLabel(value, width),
      )),
    );
  }

  taskDurationHistogram$(sessionId: string, option: HistogramField<TaskDurationProperty>, buckets: number): Observable<HistogramData> {
    const filterField = this.taskField(option.field);
    const isSet = buildDurationFilter(filterField, this.filter(0, FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN)) as TaskFilterField.AsObject;

    return this.taskBounds$(sessionId, option.field, [isSet], task => toSecondsValue(task[option.property])).pipe(
      switchMap(bounds => this.histogram$(
        bounds,
        buckets,
        0,
        range => this.countTasks$(sessionId, this.bucketFilters(range, [isSet],
          () => buildDurationFilter(filterField, this.filter(range.lower, FilterDurationOperator.FILTER_DURATION_OPERATOR_LONGER_THAN_OR_EQUAL)) as TaskFilterField.AsObject,
          () => buildDurationFilter(filterField, this.filter(range.upper, FilterDurationOperator.FILTER_DURATION_OPERATOR_SHORTER_THAN)) as TaskFilterField.AsObject,
        )),
        value => this.durationLabel(value),
      )),
    );
  }

  resultDateHistogram$(sessionId: string, option: HistogramField<ResultDateProperty>, buckets: number): Observable<HistogramData> {
    const filterField = this.resultField(option.field);
    const isSet = this.dateFilter(filterField, 0, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER) as ResultFilterField.AsObject;

    return this.resultBounds$(sessionId, option.field, [isSet], result => toSecondsValue(result[option.property])).pipe(
      switchMap(bounds => this.histogram$(
        bounds,
        buckets,
        0,
        range => this.countResults$(sessionId, this.bucketFilters(range, [isSet],
          () => this.dateFilter(filterField, range.lower, FilterDateOperator.FILTER_DATE_OPERATOR_AFTER_OR_EQUAL) as ResultFilterField.AsObject,
          () => this.dateFilter(filterField, range.upper, FilterDateOperator.FILTER_DATE_OPERATOR_BEFORE) as ResultFilterField.AsObject,
        )),
        (value, width) => this.dateLabel(value, width),
      )),
    );
  }

  resultSizeHistogram$(sessionId: string, buckets: number): Observable<HistogramData> {
    const field = ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE;
    const filterField = this.resultField(field);

    return this.resultBounds$(sessionId, field, [], result => Number(result.size ?? 0)).pipe(
      switchMap(bounds => this.histogram$(
        bounds,
        buckets,
        1,
        range => this.countResults$(sessionId, this.bucketFilters(range, [],
          () => this.numberFilter(filterField, range.lower, FilterNumberOperator.FILTER_NUMBER_OPERATOR_GREATER_THAN_OR_EQUAL) as ResultFilterField.AsObject,
          () => this.numberFilter(filterField, range.upper, FilterNumberOperator.FILTER_NUMBER_OPERATOR_LESS_THAN) as ResultFilterField.AsObject,
        )),
        value => this.sizeLabel(value),
      )),
    );
  }

  private describe(boundaries: number[], ranges: BucketRange[], label: (value: number, width: number) => string) {
    const step = boundaries[1] - boundaries[0];

    return {
      boundaries,
      boundaryLabels: boundaries.map(value => label(value, step)),
      intervals: ranges.map(range => {
        const width = range.upper - range.lower;
        return `${label(range.lower, width)} → ${label(range.upper, width)}`;
      }),
    };
  }

  /**
   * The outer buckets are left open ended, and carry the "is set" guard instead of their outer
   * boundary. An epoch expressed in fractional seconds cannot hold nanosecond precision (a double
   * resolves about 240ns at that magnitude), so a closed outer boundary would drop the very rows
   * the bounds requests just reported. Inner boundaries stay exact: consecutive buckets serialise
   * the same double, hence the same seconds/nanos pair, leaving neither gap nor overlap.
   */
  private bucketFilters<T>(range: BucketRange, guard: T[], lower: () => T, upper: () => T): T[] {
    return [
      ...(range.isFirst ? guard : [lower()]),
      ...(range.isLast ? [] : [upper()]),
    ];
  }

  private histogram$(bounds: Bounds, buckets: number, minWidth: number, count: (range: BucketRange) => Observable<number>, label: (value: number, width: number) => string): Observable<HistogramData> {
    // A guarded field left at 0 on both bounds is not reported by the server at all: comparison
    // filters do not exclude unset values, so binning it would draw one bar labelled "0s" holding
    // every row, which reads as "everything took no time" instead of "nothing was measured". The
    // total is kept, so the card can say "not reported" rather than "this session is empty".
    if (bounds.total === 0 || (minWidth === 0 && bounds.min === 0 && bounds.max === 0)) {
      return of({ boundaries: [], boundaryLabels: [], intervals: [], counts: [], total: bounds.total });
    }

    const boundaries = computeBoundaries(bounds.min, bounds.max, buckets, minWidth);
    const ranges = toRanges(boundaries);

    // A lone bucket carries the guard alone, which is the filter set of the bounds requests: its
    // count is already known.
    if (ranges.length === 1) {
      return of({ ...this.describe(boundaries, ranges, label), counts: [bounds.total], total: bounds.total });
    }

    return from(ranges).pipe(
      mergeMap((range, index) => count(range).pipe(map(value => ({ index, value }))), MAX_CONCURRENT_HISTOGRAM_REQUESTS),
      toArray(),
      map(entries => ({
        ...this.describe(boundaries, ranges, label),
        counts: entries.sort((a, b) => a.index - b.index).map(entry => entry.value),
        total: bounds.total,
      })),
    );
  }

  /**
   * Reads the extreme values of a field: the only two requests of an histogram returning a row.
   */
  private taskBounds$(sessionId: string, field: TaskSummaryEnumField | ResultRawEnumField, and: TaskFilterField.AsObject[], read: (task: TaskSummary) => number): Observable<Bounds> {
    const request = (direction: SortDirection) => new ListTasksRequest({
      page: 0,
      pageSize: 1,
      sort: { direction, field: { taskSummaryField: { field: field as TaskSummaryEnumField } } },
      filters: { or: [{ and: [this.taskSessionFilter(sessionId), ...and] }] },
    });

    return forkJoin({
      first: this.tasksClient.listTasks(request(SortDirection.SORT_DIRECTION_ASC)),
      last: this.tasksClient.listTasks(request(SortDirection.SORT_DIRECTION_DESC)),
    }).pipe(
      map(({ first, last }) => ({
        min: first.tasks?.[0] ? read(first.tasks[0]) : 0,
        max: last.tasks?.[0] ? read(last.tasks[0]) : 0,
        total: first.total,
      })),
    );
  }

  private resultBounds$(sessionId: string, field: TaskSummaryEnumField | ResultRawEnumField, and: ResultFilterField.AsObject[], read: (result: ResultRaw) => number): Observable<Bounds> {
    const request = (direction: SortDirection) => new ListResultsRequest({
      page: 0,
      pageSize: 1,
      sort: { direction, field: { resultRawField: { field: field as ResultRawEnumField } } },
      filters: { or: [{ and: [this.resultSessionFilter(sessionId), ...and] }] },
    });

    return forkJoin({
      first: this.resultsClient.listResults(request(SortDirection.SORT_DIRECTION_ASC)),
      last: this.resultsClient.listResults(request(SortDirection.SORT_DIRECTION_DESC)),
    }).pipe(
      map(({ first, last }) => ({
        min: first.results?.[0] ? read(first.results[0]) : 0,
        max: last.results?.[0] ? read(last.results[0]) : 0,
        total: first.total,
      })),
    );
  }

  private countTasks$(sessionId: string, and: TaskFilterField.AsObject[]): Observable<number> {
    const request = new ListTasksRequest({
      page: 0,
      pageSize: 0,
      sort: { direction: SortDirection.SORT_DIRECTION_ASC, field: { taskSummaryField: { field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID } } },
      filters: { or: [{ and: [this.taskSessionFilter(sessionId), ...and] }] },
    });

    return this.tasksClient.listTasks(request).pipe(map(response => response.total));
  }

  private countResults$(sessionId: string, and: ResultFilterField.AsObject[]): Observable<number> {
    const request = new ListResultsRequest({
      page: 0,
      pageSize: 0,
      sort: { direction: SortDirection.SORT_DIRECTION_ASC, field: { resultRawField: { field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID } } },
      filters: { or: [{ and: [this.resultSessionFilter(sessionId), ...and] }] },
    });

    return this.resultsClient.listResults(request).pipe(map(response => response.total));
  }

  private taskField(field: TaskSummaryEnumField | ResultRawEnumField): FilterField {
    return { taskSummaryField: { field: field as TaskSummaryEnumField } };
  }

  private resultField(field: TaskSummaryEnumField | ResultRawEnumField): FilterField {
    return { resultRawField: { field: field as ResultRawEnumField } };
  }

  private taskSessionFilter(sessionId: string): TaskFilterField.AsObject {
    return buildStringFilter(this.taskField(TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID), this.filter(sessionId, FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) as TaskFilterField.AsObject;
  }

  private resultSessionFilter(sessionId: string): ResultFilterField.AsObject {
    return buildStringFilter(this.resultField(ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID), this.filter(sessionId, FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) as ResultFilterField.AsObject;
  }

  /**
   * Built here rather than with `buildDateFilter`, which pins nanos to 0: bucket boundaries are
   * fractional as soon as a session spans less than one second per bucket.
   */
  private dateFilter(filterField: FilterField, seconds: number, operator: FilterDateOperator) {
    return {
      field: filterField,
      filterDate: { value: toProtobufSeconds(seconds), operator },
    };
  }

  private numberFilter(filterField: FilterField, value: number, operator: FilterNumberOperator) {
    return buildNumberFilter(filterField, this.filter(value, operator));
  }

  private filter(value: string | number, operator: number): Filter<TaskSummaryEnumField> {
    return { for: 'root', field: null, value, operator };
  }

  private dateLabel(seconds: number, width: number): string {
    const date = new Date(seconds * 1000);

    if (width >= 1) {
      return date.toLocaleString();
    }

    return `${date.toLocaleTimeString()}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  }

  private durationLabel(seconds: number): string {
    return this.durationPipe.transform(new Duration(toProtobufSeconds(seconds))) ?? $localize`0s`;
  }

  private sizeLabel(bytes: number): string {
    return this.byteArrayService.byteLengthToString(bytes) ?? $localize`0 o`;
  }
}
