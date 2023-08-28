import {
  ApplicationRawEnumField,
  PartitionRawEnumField,
  ResultRawEnumField,
  SessionRawEnumField,
  SortDirection,
  TaskSummaryEnumField,
} from '@aneoconsultingfr/armonik.api.angular';

export type GrpcListApplicationsParams = GrpcListParams<
  ApplicationRawEnumField[],
  SortDirection,
  Record<string, unknown>
>;

export type GrpcListSessionsParams = GrpcListParams<
  SessionRawEnumField,
  SortDirection,
  Record<string, unknown>
>;

export type GrpcListTasksParams = GrpcListParams<
  TaskSummaryEnumField,
  SortDirection,
  Record<string, unknown>
>;

export type GrpcListResultsParams = GrpcListParams<
  ResultRawEnumField,
  SortDirection,
  Record<string, unknown>
>;

export type GrpcListPartitionsParams = GrpcListParams<
  PartitionRawEnumField,
  SortDirection,
  Record<string, unknown>
>;

type GrpcListParams<
  T extends number | number[],
  K extends number,
  J extends Record<string, any>
> = {
  page: number;
  pageSize: number;
  orderBy: T;
  order: K;
  filter?: J & { [key: string]: any };
};
