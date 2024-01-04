import { ApplicationRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FilterFor } from '@app/types/filter-definition';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationFilterField, ApplicationRawFilter, ApplicationsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsFiltersService {
  readonly #defaultConfigService = inject(DefaultConfigService);
  readonly #tableService = inject(TableService);

  readonly #rootField: Record<ApplicationRawEnumField, string> = {
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME]: 'Name',
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE]: 'Namespace',
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE]: 'Service',
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION]: 'Version',
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED]: 'Unspecified',
  };

  readonly #filtersDefinitions: ApplicationsFiltersDefinition[] = [
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE,
      type: 'string',
    },
    {
      for: 'root',
      field: ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION,
      type: 'string',
    }
  ];

  readonly #defaultFilters: ApplicationRawFilter = this.#defaultConfigService.defaultApplications.filters;

  saveFilters(filters: ApplicationRawFilter): void {
    this.#tableService.saveFilters('applications-filters', filters);
  }

  restoreFilters(): ApplicationRawFilter {
    return this.#tableService.restoreFilters<ApplicationRawEnumField, null>('applications-filters', this.#filtersDefinitions) ?? this.#defaultFilters;
  }

  resetFilters(): ApplicationRawFilter {
    this.#tableService.resetFilters('applications-filters');

    return this.#defaultFilters;
  }

  retrieveFiltersDefinitions() {
    return this.#filtersDefinitions;
  }

  retrieveLabel(filterFor: FilterFor<ApplicationRawEnumField, null>, filterField:  ApplicationFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.#rootField[filterField as ApplicationRawEnumField];
    case 'options':
      throw new Error('Impossible case');
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }

  retrieveField(filterField: string): ApplicationFilterField  {
    const values = Object.values(this.#rootField);
    return values.findIndex(value => value.toLowerCase() === filterField.toLowerCase());
  }
}
