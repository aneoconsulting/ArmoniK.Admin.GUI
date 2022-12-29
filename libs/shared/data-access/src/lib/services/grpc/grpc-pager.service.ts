import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { ListApplicationsRequest } from '../../proto/generated/applications-common.pb';
import { ListResultsRequest } from '../../proto/generated/results-common.pb';
import { ListSessionsRequest } from '../../proto/generated/sessions-common.pb';
import { ListTasksRequest } from '../../proto/generated/tasks-common.pb';
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
      resultsFilter: {
        ownerTaskId: '',
        sessionId: '',
        status: 0,
        name: '',
      } as ListResultsRequest.Filter,
      applicationsFilter: {
        name: '',
        namespace: '',
        service: '',
        version: '',
      } as ListApplicationsRequest.Filter,
      sessionsFilter: {
        applicationName: '',
        applicationVersion: '',
        sessionId: '',
        status: 0,
      } as ListSessionsRequest.Filter,
      tasksFilter: {
        sessionId: '',
        status: 0,
      } as ListTasksRequest.Filter,
    };
    const filters: {
      property: string;
      value: number | string | { before: number | null; after: number | null };
    }[] = state.filters ?? [];
    filters.forEach((f) => {
      switch (f.property) {
        case 'applicationName': {
          filter.sessionsFilter.applicationName = f.value as string;
          break;
        }
        case 'applicationVersion': {
          filter.sessionsFilter.applicationVersion = f.value as string;
          break;
        }
        case 'sessionId': {
          filter.resultsFilter.sessionId = f.value as string;
          filter.sessionsFilter.sessionId = f.value as string;
          filter.tasksFilter.sessionId = f.value as string;
          break;
        }
        case 'ownerTaskId': {
          filter.resultsFilter.ownerTaskId = f.value as string;
          break;
        }
        case 'name': {
          filter.applicationsFilter.name = f.value as string;
          filter.resultsFilter.name = f.value as string;
          break;
        }
        case 'status': {
          filter.resultsFilter.status = f.value as number;
          filter.sessionsFilter.status = f.value as number;
          filter.tasksFilter.status = f.value as number;
          break;
        }
        case 'createdAt': {
          const value = f.value as {
            before: number | null;
            after: number | null;
          };
          if (value.before) {
            const timeValue = this._createTimeFilter(value.before) as Timestamp;
            filter.sessionsFilter.createdBefore = timeValue;
            filter.resultsFilter.createdBefore = timeValue;
            filter.tasksFilter.createdBefore = timeValue;
          }
          if (value.after) {
            const timeValue = this._createTimeFilter(
              value.after + 86400000
            ) as Timestamp;
            filter.sessionsFilter.createdAfter = timeValue;
            filter.resultsFilter.createdAfter = timeValue;
            filter.tasksFilter.createdAfter = timeValue;
          }
          break;
        }
        case 'startedAt': {
          const value = f.value as {
            before: number | null;
            after: number | null;
          };
          if (value.before) {
            filter.tasksFilter.startedBefore = this._createTimeFilter(
              value.before
            ) as Timestamp;
          }
          if (value.after) {
            filter.tasksFilter.startedAfter = this._createTimeFilter(
              (f.value as number) + 86400000
            ) as Timestamp;
          }
          break;
        }
        case 'endedAt': {
          const value = f.value as {
            before: number | null;
            after: number | null;
          };
          if (value.before) {
            filter.tasksFilter.endedBefore = this._createTimeFilter(
              value.before
            ) as Timestamp;
          }
          if (value.after) {
            filter.tasksFilter.endedAfter = this._createTimeFilter(
              value.after + 86400000
            ) as Timestamp;
          }
          break;
        }
        case 'closedAt': {
          const value = f.value as {
            before: number | null;
            after: number | null;
          };
          if (value.before) {
            filter.sessionsFilter.cancelledBefore = this._createTimeFilter(
              f.value as number
            ) as Timestamp;
          }
          if (value.after) {
            filter.sessionsFilter.cancelledAfter = this._createTimeFilter(
              (f.value as number) + 86400000
            ) as Timestamp;
          }

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
