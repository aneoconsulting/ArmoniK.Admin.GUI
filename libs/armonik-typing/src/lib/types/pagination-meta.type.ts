export type PaginationMeta = {
  currentPage: number;
  nextPage: number | null;
  prevPage: number | null;
  perPage: number;
  firstPage: number;
  lastPage: number;
  total: number;
};
