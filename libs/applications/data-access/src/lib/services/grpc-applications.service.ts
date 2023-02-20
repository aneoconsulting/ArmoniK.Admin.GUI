import { Injectable } from '@angular/core';
import {
  ApplicationsClient,
  BaseGrpcService,
  CountTasksByStatusApplicationRequest,
  CountTasksByStatusApplicationResponse,
  GrpcListApplicationsParams,
  GrpcParamsService,
  ListApplicationsRequest,
  ListApplicationsResponse,
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
        [orderBy ?? ListApplicationsRequest.OrderByField.ORDER_BY_FIELD_NAME],
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
      orderBy,
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
        fields: [...orderBy],
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

  public countTasksByStatus$({
    name,
    version,
  }: {
    name: string;
    version: string;
  }): Observable<CountTasksByStatusApplicationResponse> {
    const options = new CountTasksByStatusApplicationRequest({
      name,
      version,
    });

    return this._applicationsClient
      .countTasksByStatus(options)
      .pipe(takeUntil(this._timeout$));
  }
}
