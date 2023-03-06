import {
  CancelSessionRequest,
  CancelSessionResponse,
  GetSessionRequest,
  GetSessionResponse,
  ListSessionsRequest,
  ListSessionsResponse,
  SessionsClient,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcListSessionsParams,
  GrpcParamsService,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcSessionsService extends BaseGrpcService {
  constructor(
    private _sessionsClient: SessionsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(state: ClrDatagridStateInterface) {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ListSessionsRequest.OrderByField,
      ListSessionsRequest.OrderDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListSessionsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      orderBy:
        orderBy ?? ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT,
      order,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListSessionsParams,
    refreshInterval: number
  ) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== ListSessionsRequest.OrderByField.ORDER_BY_FIELD_CREATED_AT
          ? orderBy
          : undefined,
      order:
        order !== ListSessionsRequest.OrderDirection.ORDER_DIRECTION_ASC
          ? order
          : undefined,
      sessionId: filter?.sessionId,
      status: filter?.status,
      createdBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.createdBefore
      ),
      createdAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.createdAfter
      ),
      cancelledBefore: this._grpcParamsService.getTimeStampSeconds(
        filter?.cancelledBefore
      ),
      cancelledAfter: this._grpcParamsService.getTimeStampSeconds(
        filter?.cancelledAfter
      ),
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListSessionsParams): ListSessionsRequest {
    return new ListSessionsRequest({
      page,
      pageSize,
      sort: {
        field: orderBy,
        direction: order,
      },
      filter,
    });
  }

  public list$(options: ListSessionsRequest): Observable<ListSessionsResponse> {
    return this._sessionsClient
      .listSessions(options)
      .pipe(takeUntil(this._timeout$));
  }

  public get$(sessionId: string): Observable<GetSessionResponse> {
    const options = new GetSessionRequest({
      sessionId,
    });

    return this._sessionsClient
      .getSession(options)
      .pipe(takeUntil(this._timeout$));
  }

  public cancel$(sessionId: string): Observable<CancelSessionResponse> {
    const options = new CancelSessionRequest({
      sessionId,
    });

    return this._sessionsClient.cancelSession(options);
  }
}
