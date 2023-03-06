import { ListApplicationsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListPartitionsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListResultsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListSessionsRequest } from '@aneoconsultingfr/armonik.api.angular';
import { ListTasksRequest } from '@aneoconsultingfr/armonik.api.angular';

export type GrpcListApplicationsParams = GrpcListParams<
  ListApplicationsRequest.OrderByField[],
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
