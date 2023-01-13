import { Injectable } from '@angular/core';
import {
  ApplicationsClient,
  BaseGrpcService,
  ListApplicationsRequest,
  ListApplicationsResponse,
  GrpcListApplicationsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcApplicationsService extends BaseGrpcService {
  constructor(
    private _applicationsClient: ApplicationsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListApplicationsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ListApplicationsRequest.OrderByField,
      ListApplicationsRequest.OrderDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListApplicationsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      orderBy:
        orderBy ?? ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME,
      order,
      filter,
    };
  }

  public createListRequestQueryParams({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListApplicationsParams) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      orderBy:
        orderBy !== ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME
          ? orderBy
          : undefined,
      order:
        order !== ListApplicationsRequest.OrderDirection.ORDER_DIRECTION_ASC
          ? order
          : undefined,
      ...filter,
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListApplicationsParams): ListApplicationsRequest {
    return new ListApplicationsRequest({
      page,
      pageSize,
      sort: {
        field: orderBy,
        direction: order,
      },
      filter,
    });
  }

  public list$(
    options: ListApplicationsRequest
  ): Observable<ListApplicationsResponse> {
    return this._applicationsClient
      .listApplications(options)
      .pipe(takeUntil(this._timeout$));
  }
}
