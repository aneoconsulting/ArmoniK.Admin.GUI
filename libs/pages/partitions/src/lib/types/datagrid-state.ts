import { ClrDatagridSortOrder } from "@clr/angular";
import { DatagridFilter } from "./datagrid-filter";

export type DatagridState = {
  page: number,
  pageSize: number,
  orderBy: string,
  order: ClrDatagridSortOrder,
  filters?: DatagridFilter[]
};
