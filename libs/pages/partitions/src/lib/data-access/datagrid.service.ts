import { Injectable } from "@angular/core";
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from "@clr/angular";
import { UrlService } from "./url.service";
import { DatagridState } from "../types/datagrid-state";
import { DatagridFilter } from "../types/datagrid-filter";

@Injectable()
export class DatagridService {
  constructor(
    private _urlService: UrlService,
  ) { }

  public generateQueryParams(state: ClrDatagridStateInterface): Record<string, string | number> {
    const datagridState = this.clrStateToDatagridState(state);
    return this.datagridStateToQueryParams(datagridState);
  }

  public datagridStateToQueryParams(datagridState: DatagridState): Record<string, string | number> {
    return {
      page: datagridState.page,
      pageSize: datagridState.pageSize,
      orderBy: datagridState.orderBy,
      order: datagridState.order,
      ...this._flattenFilters(datagridState.filters ?? []),
    };
  }


  public clrStateToDatagridState(state: ClrDatagridStateInterface): DatagridState {
    return {
      page: state?.page?.current ?? 0,
      pageSize: state?.page?.size ?? 0,
      orderBy: (state?.sort?.by) as string ?? '',
      order: state?.sort?.reverse ? -1 : 1,
      filters: state?.filters?.map(filter => ({
        field: filter.property,
        value: filter.value,
      })) ?? [],
    };
  }

  public getQueryParamsPage(): number {
    return Number(this._urlService.getQueryParams('page'));
  }

  public getQueryParamsPageSize(): number {
    return Number(this._urlService.getQueryParams('pageSize'));
  }

  public getQueryParamsOrderByColumn(columnName: string): ClrDatagridSortOrder {
    const orderBy = this._urlService.getQueryParams('orderBy');
    const order = this._urlService.getQueryParams('order');

    if (orderBy === columnName) {
      return Number(order) as ClrDatagridSortOrder.ASC | ClrDatagridSortOrder.DESC;
    }

    // If column name is not the same as orderBy, return UNSORTED
    return ClrDatagridSortOrder.UNSORTED;
  }

  private _flattenFilters(filters: DatagridFilter[]): { [key: string]: string } {
    return filters.reduce((acc, filter) => {
      acc[filter.field] = filter.value;
      return acc;
    }, {} as { [key: string]: string });
  }
}
