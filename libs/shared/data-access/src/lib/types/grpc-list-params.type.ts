import { ListApplicationsRequest } from '../proto/generated/applications-common.pb';
import { ListPartitionsRequest } from '../proto/generated/partitions-common.pb';
import { ListResultsRequest } from '../proto/generated/results-common.pb';
import { ListSessionsRequest } from '../proto/generated/sessions-common.pb';
import { ListTasksRequest } from '../proto/generated/tasks-common.pb';

export type GrpcListApplicationsParams = GrpcListParams<
  ListApplicationsRequest.OrderByField,
  ListApplicationsRequest.OrderDirection,
  ListApplicationsRequest.Filter.AsObject
>;

export type GrpcListSessionsParams = GrpcListParams<
  ListSessionsRequest.OrderByField,
  ListSessionsRequest.OrderDirection,
  ListSessionsRequest.Filter.AsObject
>;

export type GrpcListTasksParams = GrpcListParams<
  ListTasksRequest.OrderByField,
  ListTasksRequest.OrderDirection,
  ListTasksRequest.Filter.AsObject
>;

export type GrpcListResultsParams = GrpcListParams<
  ListResultsRequest.OrderByField,
  ListResultsRequest.OrderDirection,
  ListResultsRequest.Filter.AsObject
>;

export type GrpcListPartitionsParams = GrpcListParams<
  ListPartitionsRequest.OrderByField,
  ListPartitionsRequest.OrderDirection,
  ListPartitionsRequest.Filter.AsObject
>;

type GrpcListParams<
  T extends number,
  K extends number,
  J extends Record<string, any>
> = {
  page: number;
  pageSize: number;
  orderBy: T;
  order: K;
  filter?: J;
};
