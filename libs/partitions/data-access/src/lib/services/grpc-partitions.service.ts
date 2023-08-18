import {
  FilterNumberOperator,
  FilterStringOperator,
  GetPartitionRequest,
  GetPartitionResponse,
  ListPartitionsRequest,
  ListPartitionsResponse,
  PartitionFilters,
  PartitionRawEnumField,
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
      PartitionRawEnumField,
      SortDirection
    >(state);

    const filter =
      this._grpcParamsService.createFilterParams<PartitionFilters>(
        state
      );

    return {
      page,
      pageSize,
      order,
      orderBy: orderBy ?? PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
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
        orderBy !== PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
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
    const filters: PartitionFilters.AsObject = {
      or: [{
        and: []
      }]
    };

    const keys = Object.keys(filter ?? {});
    const numberKeys = [
      'podReserved',
      'podMax',
      'preemptionPercentage',
      'priority',
    ]
    for (const key of keys) {
      let fieldId: PartitionRawEnumField = 0;
      switch (key) {
        case 'id':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID;
        break;
        case 'parentId':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS;
        break;
        case 'podReserved':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED;
        break;
        case 'podMax':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX;
        break;
        case 'preemptionPercentage':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PREEMPTION_PERCENTAGE;
        break;
        case 'priority':
          fieldId = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY;
        break;
      }

      if (numberKeys.includes(key)) {
        filters.or?.[0].and?.push({
          field: {
            partitionRawField: {
              field: fieldId,
            }
          },
          filterNumber: {
            operator: FilterNumberOperator.FILTER_NUMBER_OPERATOR_EQUAL,
            value: filter?.[key].toString()
          }
        })
      } else {
        filters.or?.[0].and?.push({
          field: {
            partitionRawField: {
              field: fieldId,
            }
          },
          filterString: {
            operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
            value: filter?.[key]
          }
        })
      }
    }

    return new ListPartitionsRequest({
      page,
      pageSize,
      sort: {
        field: {
          partitionRawField: {
            field: orderBy,
          },
        },
        direction: order,
      },
      filters,
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
