export type GrpcParams<T, K> = {
  page?: number;
  pageSize?: number;
  orderBy?: T;
  order?: K;
};
