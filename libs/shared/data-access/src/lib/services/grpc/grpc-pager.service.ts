import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { GlobalFilter } from '../../types';
import { TimeFilter } from '../../types/time-filter-type';

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
    const params = new Map<string, string | number>();

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
    params: Map<string, string | number>
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
    params: Map<string, string | number>
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
        if (filter.value.before !== null) {
          const filterName = filter.property + 'Before';
          params.set(filterName, filter.value.before);
        }
        if (filter.value.after !== null) {
          const filterName = filter.property + 'After';
          params.set(filterName, filter.value.after);
        }
      } else {
        const filterName = filter.property as string;
        const filterValue = filter.value as string;
        params.set(filterName, filterValue);
      }
    }
  }

  public createGrpcParams(
    state: ClrDatagridStateInterface,
    data: Record<string, string | number | GlobalFilter> = {}
  ) {
    const params = new Map<string, string | number>();

    this._createPage(state, params);
    this._createOrder(state, params);

    const paramsFilter = params as Map<string, string | number | GlobalFilter>;

    this._createGrpcParamsFilters(state, paramsFilter);

    return { ...Object.fromEntries(paramsFilter), ...data };
  }

  private _createGrpcParamsFilters(
    state: ClrDatagridStateInterface,
    params: Map<string, string | number | GlobalFilter>
  ) {
    const filter: GlobalFilter = {
      applicationName: '',
      applicationVersion: '',
      sessionId: '',
      status: 0,
      ownerTaskId: '',
    };

    const filters: { property: string; value: number | string }[] =
      state.filters ?? [];
    filters.forEach((f) => {
      switch (f.property) {
        case 'applicationName': {
          filter.applicationName = f.value as string;
          break;
        }
        case 'applicationVersion': {
          filter.applicationVersion = f.value as string;
          break;
        }
        case 'sessionId': {
          filter.sessionId = f.value as string;
          break;
        }
        case 'ownerTaskId': {
          filter.ownerTaskId = f.value as string;
          break;
        }
        case 'name': {
          filter.name = f.value as string;
          break;
        }
        case 'status': {
          filter.status = f.value as number;
          break;
        }
        case 'createdAtBefore': {
          filter.createdBefore = this._createTimeFilter(f.value as number);
          break;
        }
        case 'createdAtAfter': {
          filter.createdAfter = this._createTimeFilter(
            (f.value as number) + 86400000
          );
          break;
        }
        case 'starteAtdBefore': {
          filter.startedBefore = this._createTimeFilter(f.value as number);
          break;
        }
        case 'startedAfter': {
          filter.startedAfter = this._createTimeFilter(
            (f.value as number) + 86400000
          );
          break;
        }
        case 'endedAtBefore': {
          filter.endedBefore = this._createTimeFilter(f.value as number);
          break;
        }
        case 'endedAtAfter': {
          filter.endedAfter = this._createTimeFilter(
            (f.value as number) + 86400000
          );
          break;
        }
        case 'closeAtdBefore': {
          filter.closedBefore = this._createTimeFilter(f.value as number);
          break;
        }
        case 'closedAtAfter': {
          filter.closedAfter = this._createTimeFilter(
            (f.value as number) + 86400000
          );
          break;
        }
      }
    });

    params.set('filter', filter);
  }

  private _createTimeFilter(value: number): TimeFilter {
    return {
      nanos: 0,
      seconds: (value / 1000).toString(),
    };
  }
}
