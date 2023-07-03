import {
  GetPartitionRequest,
  GetPartitionResponse,
  ListPartitionsRequest,
  ListPartitionsResponse,
  PartitionRawField,
  PartitionsClient,
  SortDirection,
} from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import {
  BaseGrpcService,
  GrpcParamsService,
  GrpcListPartitionsParams,
} from '@armonik.admin.gui/shared/data-access';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Observable, takeUntil } from 'rxjs';

@Injectable()
export class GrpcPartitionsService extends BaseGrpcService {
  constructor(
    private _partitionsClient: PartitionsClient,
    private _grpcParamsService: GrpcParamsService
  ) {
    super();
  }

  public createListRequestParams(
    state: ClrDatagridStateInterface
  ): GrpcListPartitionsParams {
    const { page, pageSize } = this._grpcParamsService.createPagerParams(state);

    const { orderBy, order } = this._grpcParamsService.createSortParams<
      PartitionRawField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<ListPartitionsRequest.Filter.AsObject>(
        state
      );

    return {
      page,
      pageSize,
      order,
      orderBy: orderBy ?? PartitionRawField.PARTITION_RAW_FIELD_ID,
      filter,
    };
  }

  public createListRequestQueryParams(
    { page, pageSize, orderBy, order, filter }: GrpcListPartitionsParams,
    refreshInterval: number
  ) {
    return {
      page: page !== 0 ? page : undefined,
      pageSize: pageSize !== 10 ? pageSize : undefined,
      interval: refreshInterval !== 10000 ? refreshInterval : undefined,
      orderBy:
        orderBy !== PartitionRawField.PARTITION_RAW_FIELD_ID
          ? orderBy
          : undefined,
      order: order !== SortDirection.SORT_DIRECTION_ASC ? order : undefined,
      ...filter,
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
        field: {
          partitionRawField: orderBy,
        },
        direction: order,
      },
      filter,
    });
  }

  public list$(
    options: ListPartitionsRequest
  ): Observable<ListPartitionsResponse> {
    return this._partitionsClient
      .listPartitions(options)
      .pipe(takeUntil(this._timeout$));
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
