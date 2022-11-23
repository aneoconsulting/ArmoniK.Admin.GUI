import { Injectable } from '@angular/core';
import { SessionStatus } from '../../types/proto/session-status.pb';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Timestamp } from '@ngx-grpc/well-known-types';
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
  ): Record<string, string | number | SessionFilter> {
    const params = new Map<string, string | SessionFilter>();

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
    params: Map<string, string | number | SessionFilter>
  ) {
    const filters = state.filters ?? [];
    const sessionFilter: SessionFilter = {};

    // filters is an array of filter
    for (const filter of filters) {
      const filterName = filter.property as string;
      if (filterName.includes('created') || filterName.includes('closed')) {
        const selectedTime =
          filter.value.length !== 0 ? new Timestamp() : undefined;
        if (selectedTime) selectedTime.seconds = filter.value;
        if (filterName === 'createdBefore') {
          sessionFilter.createdBefore = selectedTime;
        } else if (filterName === 'createdAfter') {
          sessionFilter.createdAfter = selectedTime;
        } else if (filterName === 'closedBefore') {
          sessionFilter.closedBefore = selectedTime;
        } else {
          sessionFilter.closedAfter = selectedTime;
        }
      } else if (filterName === 'status') {
        if (filter.value == '0') {
          sessionFilter.status = SessionStatus.SESSION_STATUS_UNSPECIFIED;
        } else if (filter.value == '1') {
          sessionFilter.status = SessionStatus.SESSION_STATUS_RUNNING;
        } else {
          sessionFilter.status = SessionStatus.SESSION_STATUS_CANCELLED;
        }
      } else if (filterName == 'sessionId') {
        sessionFilter.sessionId = filter.value;
      }
    }
    params.set('filter', sessionFilter);
  }
}
