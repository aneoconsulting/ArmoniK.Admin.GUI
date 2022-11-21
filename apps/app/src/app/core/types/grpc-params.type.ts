import { SessionFilter } from './session-filter.type';

export type GrpcParams<T, K> = {
  page?: number;
  pageSize?: number;
  orderBy?: T;
  order?: K;
  filter?: SessionFilter;
};
