import { ResultRawEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';

export type TaskDateProperty = 'createdAt' | 'submittedAt' | 'startedAt' | 'endedAt';
export type TaskDurationProperty = 'creationToEndDuration' | 'processingToEndDuration' | 'receivedToEndDuration';
export type ResultDateProperty = 'createdAt' | 'completedAt';

/**
 * A field the user can pick to compute an histogram: the enum used to sort and filter server side,
 * and the property holding the value on the row returned by the bounds requests.
 */
export type HistogramField<P extends string = string> = {
  label: string;
  field: TaskSummaryEnumField | ResultRawEnumField;
  property: P;
};

export type HistogramData = {
  /** Compact axis tick, the lower boundary of the bucket. */
  labels: string[];
  /** Full `lower → upper` range, shown as the tooltip title. */
  intervals: string[];
  counts: number[];
  total: number;
};

export type BucketRange = {
  lower: number;
  upper: number;
  isFirst: boolean;
  isLast: boolean;
};

export const BUCKET_COUNTS = [10, 20, 50];
export const DEFAULT_BUCKET_COUNT = 20;
