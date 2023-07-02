import {
  ListResultsRequest,
  ListResultsResponse,
  ResultRawField,
  ResultsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListResultsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcResultsService extends BaseGrpcService {
  constructor(
    private _resultsClient: ResultsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListResultsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ResultRawField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListResultsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      orderBy:
        orderBy ?? ResultRawField.RESULT_RAW_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListResultsParams,
    refreshInterval: number
  ) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== ResultRawField.RESULT_RAW_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order:
        order !== SortDirection.SORT_DIRECTION_ASC
          ? order
          : undefined,
      name: filter?.name,
      ownerTaskId: filter?.ownerTaskId,
      sessionId: filter?.sessionId,
      status: filter?.status,
      createdBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.createdBefore
      ),
      createdAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.createdAfter
      ),
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListResultsParams): ListResultsRequest {
    return new ListResultsRequest({
      page,
      pageSize,
      sort: {
        field: {
          resultRawField: orderBy,
        },
        direction: order,
      },
      filter,
    });
  }

  public list$(options: ListResultsRequest): Observable<ListResultsResponse> {
    return this._resultsClient
      .listResults(options)
      .pipe(takeUntil(this._timeout$));
  }
}
