import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

@Injectable()
export class PagerService {
  private defaultNextPage = 1;
  private defaultLimit = 10;

  /**
   * Create HttpParams from ClrDatagridStateInterface and data
   *
   * @param state ClrDatagridStateInterface
   * @param data data to be added to HttpParams, same key overrides state
   *
   * @returns HttpParams
   */
  public createHttpParams(
    state: ClrDatagridStateInterface,
    data: { [key: string]: string } = {}
  ): HttpParams {
    const params = new Map();

    this.setPage(state, params);
    this.setSort(state, params);
    this.setFilters(state, params);

    return new HttpParams({
      fromObject: { ...Object.fromEntries(params), ...data },
    });
  }

  /**
   * Set page in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string>
   *
   */
  private setPage(
    state: ClrDatagridStateInterface,
    params: Map<string, string>
  ) {
    const nextPage = state.page?.current ?? this.defaultNextPage;
    const limit = state.page?.size ?? this.defaultLimit;

    params.set('page', nextPage.toString());
    params.set('limit', limit.toString());
  }

  /**
   * Set sort in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string>
   */
  private setSort(
    state: ClrDatagridStateInterface,
    params: Map<string, string>
  ) {
    const orderBy = state.sort?.by as string;
    const order = state.sort?.reverse ? -1 : 1;
    if (orderBy) {
      params.set('orderBy', orderBy);
      params.set('order', order.toString());
    }
  }

  /**
   * Set filters in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string>
   */
  private setFilters(
    state: ClrDatagridStateInterface,
    params: Map<string, string>
  ) {
    const filters = state.filters ?? [];
    // filters is an array of filter
    for (const filter of filters) {
      const filterName = filter.property as string;
      const filterValue = filter.value as string;
      params.set(filterName, filterValue);
    }
  }
}
