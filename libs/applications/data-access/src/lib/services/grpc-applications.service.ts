import {
  ApplicationRawField,
  ApplicationsClient,
  CountTasksByStatusApplicationRequest,
  CountTasksByStatusApplicationResponse,
  ListApplicationsRequest,
  ListApplicationsResponse,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
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
      ApplicationRawField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListApplicationsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      orderBy: [
        orderBy ?? ApplicationRawField.APPLICATION_RAW_FIELD_NAME,
      ],
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListApplicationsParams,
    refreshInterval: number
  ) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy: !orderBy.includes(
        ApplicationRawField.APPLICATION_RAW_FIELD_NAME
      )
        ? orderBy
        : undefined,
      order:
        order !== SortDirection.SORT_DIRECTION_ASC
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
        fields: [...orderBy.map((field) => { return { applicationField: field } })],
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
