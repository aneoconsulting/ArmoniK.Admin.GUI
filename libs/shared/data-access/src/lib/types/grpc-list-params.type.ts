import {
  ApplicationFilters,
  ApplicationRawEnumField,
  PartitionFilters,
  PartitionRawEnumField,
  ResultFilters,
  ResultRawEnumField,
  SessionFilters,
  SessionRawEnumField,
  SortDirection,
  TaskFilters,
  TaskSummaryEnumField,
} from '@aneoconsultingfr/armonik.api.angular';

export type GrpcListApplicationsParams = GrpcListParams<
  ApplicationRawEnumField[],
  SortDirection,
  ApplicationFilters
>;

export type GrpcListSessionsParams = GrpcListParams<
  SessionRawEnumField,
  SortDirection,
  SessionFilters
>;

export type GrpcListTasksParams = GrpcListParams<
  TaskSummaryEnumField,
  SortDirection,
  TaskFilters
>;

export type GrpcListResultsParams = GrpcListParams<
  ResultRawEnumField,
  SortDirection,
  ResultFilters
>;

export type GrpcListPartitionsParams = GrpcListParams<
  PartitionRawEnumField,
  SortDirection,
  PartitionFilters
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
