import { ApplicationRawField, ListApplicationsRequest, PartitionRawField, ResultRawField, SessionRawField, SortDirection } from '@aneoconsultingfr/armonik.api.angular';
import { ListPartitionsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListResultsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListSessionsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListTasksRequest } from '@aneoconsultingfr/armonik.api.angular';
import { TaskSummaryField } from '@aneoconsultingfr/armonik.api.angular/lib/generated/tasks-common.pb';

export type GrpcListApplicationsParams = GrpcListParams<
  ApplicationRawField[],
  SortDirection,
  ListApplicationsRequest.Filter.AsObject
>;

export type GrpcListSessionsParams = GrpcListParams<
  SessionRawField,
  SortDirection,
  ListSessionsRequest.Filter.AsObject
>;

export type GrpcListTasksParams = GrpcListParams<
  TaskSummaryField,
  SortDirection,
  ListTasksRequest.Filter.AsObject
>;

export type GrpcListResultsParams = GrpcListParams<
  ResultRawField,
  SortDirection,
  ListResultsRequest.Filter.AsObject
>;

export type GrpcListPartitionsParams = GrpcListParams<
  PartitionRawField,
  SortDirection,
  ListPartitionsRequest.Filter.AsObject
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
  filter?: J;
};
