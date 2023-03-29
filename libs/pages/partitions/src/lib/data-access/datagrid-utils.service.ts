import { Injectable } from "@angular/core";
import { DatagridFilter } from "../types/datagrid-filter";
import { ClrDatagridStateInterface } from "@clr/angular";
import { DatagridState } from "../types/datagrid-state";

@Injectable()
export class DatagridUtilsService {
  /**
   * Generate query params from ClrDatagridStateInterface.
   * @param state
   *
   * @returns query params
   */
  public generateQueryParams(state: ClrDatagridStateInterface): Record<string, string | number> {
    const datagridState = this.clrStateToDatagridState(state);
    return this.datagridStateToQueryParams(datagridState);
  }

  /**
   * Create query params from datagrid state.
   * This function create a flat object with all filters.
   * @param datagridState
   *
   * @returns query params
   */
  public datagridStateToQueryParams(datagridState: DatagridState): Record<string, string | number> {
    return {
      page: datagridState.page,
      pageSize: datagridState.pageSize,
      orderBy: datagridState.orderBy,
      order: datagridState.order,
      ...this._flattenFilters(datagridState.filters ?? []),
    };
  }

  /**
   * Create datagrid state from Clarity State.
   * This function create an object with defaults values to be easily used.
   * @param state
   *
   * @returns datagrid state
   */
  public clrStateToDatagridState(state: ClrDatagridStateInterface): DatagridState {
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

  private _flattenFilters(filters: DatagridFilter[]): { [key: string]: string } {
    return filters.reduce((acc, filter) => {
      acc[filter.field] = filter.value;
      return acc;
    }, {} as { [key: string]: string });
  }
}
