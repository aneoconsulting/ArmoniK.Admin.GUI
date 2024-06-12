import { GetPartitionRequest, GetPartitionResponse, ListPartitionsRequest, ListPartitionsResponse, PartitionFilterField, PartitionRawEnumField, PartitionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Filter, FilterType } from '@app/types/filters';
import { GrpcGetInterface, GrpcTableService, ListDefaultSortField, RequestFilterField } from '@app/types/services/grpcService';
import { FilterField, buildArrayFilter, buildNumberFilter, buildStringFilter } from '@services/grpc-build-request.service';
import { PartitionsFiltersService } from './partitions-filters.service';
import { PartitionRawFieldKey, PartitionRawFilters, PartitionRawListOptions } from '../types';


@Injectable()
export class PartitionsGrpcService extends GrpcTableService<PartitionRawFieldKey, PartitionRawListOptions, PartitionRawEnumField>
  implements GrpcGetInterface<GetPartitionResponse> {
  readonly filterService = inject(PartitionsFiltersService);
  readonly grpcClient = inject(PartitionsClient);

  readonly defaultSortField = PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID;
  readonly sortFields: Record<PartitionRawFieldKey, PartitionRawEnumField> = {
    'id': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
    'parentPartitionIds': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
    'podConfiguration': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_UNSPECIFIED,
    'podMax': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
    'podReserved': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED,
    'preemptionPercentage': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PREEMPTION_PERCENTAGE,
    'priority': PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
  };

  list$(options: PartitionRawListOptions, filters: PartitionRawFilters): Observable<ListPartitionsResponse> {
    const listPartitionsRequest = new ListPartitionsRequest(this.createListRequest(options, filters) as ListPartitionsRequest);
    return this.grpcClient.listPartitions(listPartitionsRequest);
  }

  get$(id: string): Observable<GetPartitionResponse> {
    const getPartitionRequest = new GetPartitionRequest({
      id
    });

    return this.grpcClient.getPartition(getPartitionRequest);
  }

  createSortField(field: PartitionRawEnumField): ListDefaultSortField {
    return {
      field: {
        partitionRawField: {
          field
        }
      }
    };
  }

  createFilterField(field: PartitionRawEnumField) {
    return {
      partitionRawField: {
        field
      }
    } satisfies PartitionFilterField.AsObject['field'];
  }

  buildFilter(type: FilterType, filterField: FilterField, filter: Filter<PartitionRawEnumField, null>): RequestFilterField {
    switch (type) {
    case 'string':
      return buildStringFilter(filterField, filter) as PartitionFilterField.AsObject;
    case 'number':
      return buildNumberFilter(filterField, filter) as PartitionFilterField.AsObject;
    case 'array':
      return buildArrayFilter(filterField, filter) as PartitionFilterField.AsObject;
    default: {
      throw new Error(`Type ${type} not supported`);
    }
    }
  }
}
