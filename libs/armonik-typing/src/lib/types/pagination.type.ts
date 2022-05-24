import { PaginationMeta } from './pagination-meta.type';

export type Pagination<T> = {
  meta: PaginationMeta;
  data: T[];
};
