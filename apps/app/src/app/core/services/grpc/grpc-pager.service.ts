import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { SessionFilter } from '../../types/session-filter.type';
@Injectable()
export class GrpcPagerService {
  private defaultCurrentPage = 0;
  private defaultLimit = 10;

  /**
   * Create object from ClrDatagridStateInterface and data
   *
   * @param state ClrDatagridStateInterface
   * @param data data to be added to object, can overrides state
   *
   * @returns Record<string, string | number>
   */
  public createParams(
    state: ClrDatagridStateInterface,
    data: Record<string, string | number> = {}
  ): Record<string, string | number> {
    const params = new Map<string, string>();

    this._createPage(state, params);
    this._createOrder(state, params);
    this._createFilters(state, params);

    return { ...Object.fromEntries(params), ...data };
  }

  /**
   * Set page in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string | number>
   *
   */
  private _createPage(
    state: ClrDatagridStateInterface,
    params: Map<string, string | number | SessionFilter>
  ) {
    const page = state.page?.current
      ? state.page.current - 1
      : this.defaultCurrentPage;
    const limit = state.page?.size ?? this.defaultLimit;

    params.set('page', page);
    params.set('pageSize', limit);
  }

  /**
   * Set order in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string | number>
   */
  private _createOrder(
    state: ClrDatagridStateInterface,
    params: Map<string, string | number | SessionFilter>
  ) {
    const orderBy = state.sort?.by as string;
    const order = state.sort?.reverse ? -1 : 1;
    if (orderBy) {
      params.set('orderBy', orderBy);
      params.set('order', order);
    }
  }

  /**
   * Set filters in Map
   *
   * @param state ClrDatagridStateInterface
   * @param params Map<string, string | number>
   */
  private _createFilters(
    state: ClrDatagridStateInterface,
    params: Map<string, string | number>
  ) {
    const filters = state.filters ?? [];
    // filters is an array of filter
    for (const filter of filters) {
      if (filter.property.includes('At')) {
        const filterDate = JSON.parse(filter.value);
        if (filterDate.before !== 'null') {
          const filterName = filter.property + 'Before';
          params.set(filterName, filterDate.before);
        }
        if (filterDate.after !== 'null') {
          const filterName = filter.property + 'After';
          params.set(filterName, filterDate.after);
        }
      } else {
        const filterName = filter.property as string;
        const filterValue = filter.value as string;
        params.set(filterName, filterValue);
      }
    }
  }
}
