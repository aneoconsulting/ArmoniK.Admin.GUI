import { Injectable } from "@angular/core";
import { URLService } from "./url.service";
import { Observable, combineLatest, filter, map, startWith } from "rxjs";
import { ClrDatagridSortOrder } from "@clr/angular";
import { DatagridStorageService } from "./datagrid-storage.service";

@Injectable()
export class DatagridURLService {
  constructor(private _URLService: URLService, private _datagridStorageService: DatagridStorageService) {
  }

  /**
   * Get query params for page.
   * If page is not set, return default value 1.
   *
   * @returns Observable<number>
   */
  public getQueryParamsPage$(): Observable<number> {
    return this._URLService.getQueryParams$('page').pipe(
      startWith(this._restoreQueryParams()['page']),
      filter(page => !!page),
      map(page => page ? Number(page) : 1)
    );
  }

  /**
   * Get query params for page size.
   * If page size is not set, return default value 10.
   *
   * @returns Observable<number>
   */
  public getQueryParamsPageSize$(): Observable<number> {
    return this._URLService.getQueryParams$('pageSize').pipe(
      startWith(this._restoreQueryParams()['pageSize']),
      filter(pageSize => !!pageSize),
      map(pageSize => pageSize ? Number(pageSize) : 10),
    );
  }

  /**
   * Get query params for filtering by column.
   * If column is not filtered, return empty string.
   */
  public getQueryParamsFilterByColumn$(columnName: string): Observable<string> {
    return this._URLService.getQueryParams$(columnName).pipe(
      startWith(this._restoreQueryParams()[columnName]),
      map(filter => filter ? filter as string : ''),
    );
  }

  /**
   * Get query params for sorting by column. If column is not sorted, return UNSORTED.
   * Compare provided column name with orderBy query param to calculate sort order.
   * @param columnName
   *
   * @returns Observable<ClrDatagridSortOrder>
   */
  public getQueryParamsOrderByColumn$(columnName: string): Observable<ClrDatagridSortOrder> {
    return combineLatest([
      this._URLService.getQueryParams$('orderBy').pipe(
        startWith(this._restoreQueryParams()['orderBy']),
      ),
      this._URLService.getQueryParams$('order').pipe(
        startWith(this._restoreQueryParams()['order']),
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

  /**
   * Reset sorting query params to their default value.
   */
  public resetSortFromQueryParams(): void {
    // Using 'order' has no effect.
    this._URLService.resetQueryParamsByRemoving(['orderBy']);
  }

  /**
   * Remove filtering from query params.
   */
  public resetFilteringFromQueryParams(): void {
    this._URLService.resetQueryParamsByKeeping(['page', 'pageSize', 'orderBy', 'order']);
  }

  /**
   * Restore query params from storage to setup initial state of datagrid
   */
  private _restoreQueryParams(): Record<string, string | number> {
    return this._datagridStorageService.restoreQueryParams() ?? {};
  }
}
