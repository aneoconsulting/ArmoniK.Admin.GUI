import { Injectable } from '@angular/core';
import {
  PartitionsClient,
  BaseGrpcService,
  ListPartitionsRequest,
  ListPartitionsResponse,
  GrpcParamsService,
  GetPartitionResponse,
  GetPartitionRequest,
  GrpcListPartitionsParams,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcPartitionsService extends BaseGrpcService {
  constructor(private _partitionsClient: PartitionsClient, private _grpcParamsService: GrpcParamsService) {
    super();
  }

  public createListRequestParams(state: ClrDatagridStateInterface): GrpcListPartitionsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      ListPartitionsRequest.OrderByField,
      ListPartitionsRequest.OrderDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListPartitionsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      order,
      orderBy: orderBy ?? ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
      filter
    }
  }

  public createListRequestQueryParams({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListPartitionsParams) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      orderBy:
        orderBy !== ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID
          ? orderBy
          : undefined,
      order:
        order !== ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC
          ? order
          : undefined,
      ...filter
    };
  }

  public createListRequestOptions({
    page,
    pageSize,
    orderBy,
    order,
    filter,
  }: GrpcListPartitionsParams): ListPartitionsRequest {
    return new ListPartitionsRequest({
      page,
      pageSize,
      sort: {
        field: orderBy,
        direction: order,
      },
      filter
    })
  }

  public list$(options: ListPartitionsRequest): Observable<ListPartitionsResponse> {
    return this._partitionsClient.listPartitions(options).pipe(takeUntil(this._timeout$));
  }

  public get$(paramId: string): Observable<GetPartitionResponse> {
    const options = new GetPartitionRequest({
      id: paramId,
    });

    return this._partitionsClient
      .getPartition(options)
      .pipe(takeUntil(this._timeout$));
  }
}
