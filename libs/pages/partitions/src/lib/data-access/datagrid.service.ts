import { Injectable } from "@angular/core";
import { ClrDatagridSortOrder, ClrDatagridStateInterface } from "@clr/angular";
import { UrlService } from "./url.service";
import { DatagridState } from "../types/datagrid-state";
import { DatagridFilter } from "../types/datagrid-filter";
import { Observable, combineLatest, distinct, filter, map, tap } from "rxjs";

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
    console.log('datagridStateToQueryParams', datagridState);
    return {
      page: datagridState.page,
      pageSize: datagridState.pageSize,
      orderBy: datagridState.orderBy,
      order: datagridState.order,
      ...this._flattenFilters(datagridState.filters ?? []),
    };
  }


  public clrStateToDatagridState(state: ClrDatagridStateInterface): DatagridState {
    console.log('clrStateToDatagridState', state);
    return {
      page: state?.page?.current ?? 1,
      pageSize: state?.page?.size ?? 10,
      orderBy: (state?.sort?.by) as string ?? '',
      order: state?.sort?.reverse ? -1 : 1,
      filters: state?.filters?.map(filter => ({
        field: filter.property,
        value: filter.value,
      })) ?? [],
    };
  }

  public getQueryParamsPage$(): Observable<number> {
    return this._urlService.getQueryParams$('page').pipe(
      map(page => page ? Number(page) : 1)
    );
  }

  public getQueryParamsPageSize$(): Observable<number> {
    return this._urlService.getQueryParams$('pageSize').pipe(
      map(pageSize => pageSize ? Number(pageSize) : 10)
    );
  }

  public getQueryParamsOrderByColumn$(columnName: string): Observable<ClrDatagridSortOrder> {
    return combineLatest([
      this._urlService.getQueryParams$('orderBy').pipe(
        filter(orderBy => !!orderBy)
      ),
      this._urlService.getQueryParams$('order').pipe(
        filter(order => !!order)
      ),
    ]).pipe(
      map(([orderBy, order]) => {
        if (!orderBy || !order) {
          return ClrDatagridSortOrder.UNSORTED;
        }

        if (orderBy === columnName) {
          return Number(order) as ClrDatagridSortOrder.ASC | ClrDatagridSortOrder.DESC;
        } else {
          return ClrDatagridSortOrder.UNSORTED;
        }
      }
      ),
    )
  }

  private _flattenFilters(filters: DatagridFilter[]): { [key: string]: string } {
    return filters.reduce((acc, filter) => {
      acc[filter.field] = filter.value;
      return acc;
    }, {} as { [key: string]: string });
  }
}
