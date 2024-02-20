import { GetPartitionRequest, GetPartitionResponse, ListPartitionsRequest, ListPartitionsResponse, PartitionFilterField, PartitionRawEnumField, PartitionsClient } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterType } from '@app/types/filters';
import { GrpcGetInterface, GrpcListInterface } from '@app/types/services/grpcService';
import { buildArrayFilter, buildNumberFilter, buildStringFilter, sortDirections } from '@services/grpc-build-request.service';
import { UtilsService } from '@services/utils.service';
import { PartitionsFiltersService } from './partitions-filters.service';
import { PartitionRawFieldKey, PartitionRawFilter, PartitionRawFilters, PartitionRawListOptions } from '../types';


@Injectable()
export class PartitionsGrpcService implements GrpcListInterface<PartitionsClient, PartitionRawListOptions, PartitionRawFilters, PartitionRawFieldKey, PartitionRawEnumField>, GrpcGetInterface<GetPartitionResponse> {
  readonly filterService = inject(PartitionsFiltersService);
  readonly grpcClient = inject(PartitionsClient);
  readonly utilsService = inject(UtilsService<PartitionRawEnumField>);

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
    const requestFilters = this.utilsService.createFilters<PartitionFilterField.AsObject>(filters, this.filterService.filtersDefinitions, this.#buildFilterField);

    const listPartitionsRequest = new ListPartitionsRequest({
      page: options.pageIndex,
      pageSize: options.pageSize,
      sort: {
        direction: sortDirections[options.sort.direction],
        field: {
          partitionRawField: {
            field: this.sortFields[options.sort.active] ?? PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID
          }
        }
      },
      filters: requestFilters
    });

    return this.grpcClient.listPartitions(listPartitionsRequest);
  }

  get$(id: string) :Observable<GetPartitionResponse> {
    const getPartitionRequest = new GetPartitionRequest({
      id
    });

    return this.grpcClient.getPartition(getPartitionRequest);
  }

  #buildFilterField(filter: PartitionRawFilter) {
    return (type: FilterType, field: PartitionRawEnumField) => {

      const filterField = {
        partitionRawField: {
          field
        }
      } satisfies PartitionFilterField.AsObject['field'];

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
    };
  }
}
