import { Injectable } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { FiltersEnum } from '../../enums';

@Injectable()
export class GrpcParamsService {
  private _defaultCurrentPage = 0;
  private _defaultPageSize = 10;

  public createPagerParams(state: ClrDatagridStateInterface) {
    const page = this._getPage(state);
    const pageSize = this._getPageSize(state);

    return { page, pageSize };
  }

  public createSortParams<T extends number, J extends number>(
    state: ClrDatagridStateInterface
  ) {
    const orderBy = this._getOrderBy<T>(state);
    const order = this._getOrder<J>(state);

    return { orderBy, order };
  }

  public createFilterParams<T>(state: ClrDatagridStateInterface) {
    const filter = this._getFilter<T>(state);

    return filter;
  }

  /**
   * Get page number from state
   *
   * @param state ClrDatagridStateInterface
   *
   * @returns number
   */
  private _getPage(state: ClrDatagridStateInterface): number {
    const page = state.page?.current;

    if (page) return page - 1;

    return this._defaultCurrentPage;
  }

  /**
   * Get page size from state
   *
   * @param state ClrDatagridStateInterface
   *
   * @returns number
   */
  private _getPageSize(state: ClrDatagridStateInterface): number {
    return state.page?.size ?? this._defaultPageSize;
  }

  /**
   * Get order by from state
   *
   * @param state ClrDatagridStateInterface
   *
   * @returns T | undefined
   */
  private _getOrderBy<T extends number>(
    state: ClrDatagridStateInterface
  ): T | undefined {
    return state.sort?.by as unknown as T | undefined;
  }

  /**
   * Get order from state
   *
   * @param state ClrDatagridStateInterface
   *
   * @returns T
   */
  private _getOrder<T extends number>(state: ClrDatagridStateInterface): T {
    // TODO: remove 2 (once https://github.com/aneoconsulting/ArmoniK.Api/issues/87 is resolved)
    if (state.sort?.reverse) return 2 as unknown as T;
    else return 1 as unknown as T;
  }

  /**
   * Create filters object
   *
   * @param state ClrDatagridStateInterface
   *
   * @returns T
   */
  private _getFilter<T>(state: ClrDatagridStateInterface): T {
    const filters = state.filters ?? [];
    const result = new Map();

    for (const filter of filters) {
      if (filter.type === FiltersEnum.TIME) {
        if (filter.value.before) {
          result.set(
            filter.property.before,
            this._createTimestamp(filter.value.before)
          );
        }
        if (filter.value.after) {
          result.set(
            filter.property.after,
            this._createTimestamp(filter.value.after)
          );
        }
      } else {
        result.set(filter.property, filter.value);
      }
    }

    return { ...Object.fromEntries(result) };
  }

  private _createTimestamp(value: number): Timestamp.AsObject {
    return {
      nanos: 0,
      seconds: (value / 1000).toString(),
    };
  }
}
