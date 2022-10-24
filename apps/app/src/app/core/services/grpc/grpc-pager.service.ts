import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';

@Injectable()
export class GrpcPagerService {
  private defaultCurrentPage = 0;
  private defaultLimit = 10;

  /**
   * Create HttpParams from ClrDatagridStateInterface and data
   *
   * @param params Record<string, string>
   * @param data data to be added to HttpParams, can overrides params
   *
   * @returns HttpParams
   */
  public createHttpParams(
    params: Record<string, string>,
    data: Record<string, string> = {}
  ): HttpParams {
    return new HttpParams({
      fromObject: { ...params, ...data },
    });
  }

  /**
   * Create object from ClrDatagridStateInterface and data
   *
   * @param state ClrDatagridStateInterface
   * @param data data to be added to object, can overrides state
   *
   * @returns Record<string, string>
   */
  public createParams(
    state: ClrDatagridStateInterface,
    data: Record<string, string> = {}
  ): Record<string, string> {
    console.log('state', state);

    const params = new Map();

    this._createPage(state, params);
    this._createOrder(state, params);
    this._createFilters(state, params);

    return { ...Object.fromEntries(params), ...data };
  }

  /**
   * Set page in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string>
   *
   */
  private _createPage(
    state: ClrDatagridStateInterface,
    params: Map<string, string>
  ) {
    const page = state.page?.current
      ? state.page.current - 1
      : this.defaultCurrentPage;
    const limit = state.page?.size ?? this.defaultLimit;

    params.set('page', page.toString());
    params.set('pageSize', limit.toString());
  }

  /**
   * Set order in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string>
   */
  private _createOrder(
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
  private _createFilters(
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
