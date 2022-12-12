export type GrpcParams<T, K, J> = {
  page?: number;
  pageSize?: number;
  orderBy?: T;
  order?: K;
  filter?: J;
};
