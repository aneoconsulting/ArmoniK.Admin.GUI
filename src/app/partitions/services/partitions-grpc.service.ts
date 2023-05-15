import { GetPartitionRequest, GetPartitionResponse, ListPartitionsRequest, ListPartitionsResponse, PartitionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { AppGrpcService } from '@app/types/services';
import { UtilsService } from '@services/utils.service';
import { PartitionRaw, PartitionRawFilter, PartitionRawKeyField, PartitionRawListOptions } from '../types';

@Injectable()
export class PartitionsGrpcService implements AppGrpcService<PartitionRaw> {
  readonly sortDirections: Record<SortDirection, ListPartitionsRequest.OrderDirection> = {
    'asc': ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC,
    'desc': ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_DESC,
    '': ListPartitionsRequest.OrderDirection.ORDER_DIRECTION_ASC
  };

  readonly sortFields: Record<PartitionRawKeyField, ListPartitionsRequest.OrderByField> = {
    'id': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID,
    'parentPartitionIds': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_PARENT_PARTITION_IDS,
    // TODO: Need to add the missing fields on Armonik.Api
    'podConfiguration': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_UNSPECIFIED,
    'podMax': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_MAX,
    'podReserved': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_POD_RESERVED,
    'preemptionPercentage': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_PREEMPTION_PERCENTAGE,
    'priority': ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_PRIORITY,
  };

  constructor(
    private _partitionsClient: PartitionsClient,
    private _utilsService: UtilsService<PartitionRaw>
  ) {}

  list$(options: PartitionRawListOptions, filters: PartitionRawFilter[]): Observable<ListPartitionsResponse> {
    const findFilter = this._utilsService.findFilter;
    const convertFilterValue = this._utilsService.convertFilterValue;
    const convertFilterValueToNumber = this._utilsService.convertFilterValueToNumber;

    const listPartitionsRequest = new ListPartitionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: this.sortDirections[options.sort.direction],
        field: this.sortFields[options.sort.active] ?? ListPartitionsRequest.OrderByField.ORDER_BY_FIELD_ID
      },
      filter: {
        id: convertFilterValue(findFilter(filters, 'id')),
        parentPartitionId: convertFilterValue(findFilter(filters, 'parentPartitionIds')),
        podReserved:
          convertFilterValueToNumber(findFilter(filters, 'podReserved')) as number,
        podMax: convertFilterValueToNumber(findFilter(filters, 'podMax')) as number,
        preemptionPercentage: convertFilterValueToNumber(findFilter(filters, 'preemptionPercentage')) as number,
        priority: convertFilterValueToNumber(findFilter(filters, 'priority')) as number
      }
    });

    return this._partitionsClient.listPartitions(listPartitionsRequest);
  }

  get$(id: string) :Observable<GetPartitionResponse> {
    const getPartitionRequest = new GetPartitionRequest({
      id
    });

    return this._partitionsClient.getPartition(getPartitionRequest);
  }
}
