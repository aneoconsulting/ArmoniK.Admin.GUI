import { PartitionRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FilterFor } from '@app/sessions/services/sessions-filters.service';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { PartitionFilterField, PartitionRawFiltersOr, PartitionsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class PartitionsFiltersService {
  readonly #defaultConfigService = inject(DefaultConfigService);
  readonly #tableService = inject(TableService);

  readonly #rootField: Record<PartitionRawEnumField, string> = {
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID]: $localize`ID`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS]: $localize`Parent Partition IDs`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX]: $localize`Pod Max`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED]: $localize`Pod Reserved`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PREEMPTION_PERCENTAGE]: $localize`Preemption Percentage`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY]: $localize`Priority`,
    [PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
  };

  readonly #filtersDefinitions: PartitionsFiltersDefinition[] = [
    // Do not add filter on object fields
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY,
      type: 'number',
    },
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_MAX,
      type: 'number',
    },
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_POD_RESERVED,
      type: 'number',
    },
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PREEMPTION_PERCENTAGE,
      type: 'number',
    },
    {
      for: 'root',
      field: PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PARENT_PARTITION_IDS,
      type: 'array',
    }
  ];

  readonly #defaultFilters: PartitionRawFiltersOr = this.#defaultConfigService.defaultPartitions.filters;

  saveFilters(filters: PartitionRawFiltersOr): void {
    this.#tableService.saveFilters('partitions-filters', filters);
  }

  restoreFilters(): PartitionRawFiltersOr {
    return this.#tableService.restoreFilters<PartitionRawEnumField, null>('partitions-filters', this.#filtersDefinitions) ?? this.#defaultFilters;
  }

  resetFilters(): PartitionRawFiltersOr {
    this.#tableService.resetFilters('partitions-filters');

    return this.#defaultFilters;
  }

  retriveFiltersDefinitions() {
    return this.#filtersDefinitions;
  }

  retriveLabel(filterFor: FilterFor<PartitionRawEnumField, null>, filterField:  PartitionFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.#rootField[filterField as PartitionRawEnumField];
    case 'options':
      throw new Error('Impossible case');
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }
}
