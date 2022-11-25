export type GrpcParams<T, K> = {
  page?: number;
  pageSize?: number;
  orderBy?: T;
  order?: K;
  sessionId?: string;
  status?: number | null;
  createdAtBefore?: number | null;
  createdAtAfter?: number | null;
  closedAtBefore?: number | null;
  closedAtAfter?: number | null;
};
