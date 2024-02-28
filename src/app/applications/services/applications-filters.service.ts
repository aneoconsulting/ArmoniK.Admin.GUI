import { ApplicationRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FilterFor } from '@app/types/filter-definition';
import { FiltersServiceInterface } from '@app/types/services/filtersService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ApplicationFilterField, ApplicationRawFilters, ApplicationsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsFiltersService implements FiltersServiceInterface<ApplicationRawFilters, ApplicationRawEnumField> {
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly tableService = inject(TableService);

  readonly rootField: Record<ApplicationRawEnumField, string> = {
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME]: $localize`Name`,
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE]: $localize`Namespace`,
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE]: $localize`Service`,
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION]: $localize`Version`,
    [ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_UNSPECIFIED]: 'Unspecified',
  };

  readonly filtersDefinitions: ApplicationsFiltersDefinition[] = [
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

  readonly defaultFilters: ApplicationRawFilters = this.defaultConfigService.defaultApplications.filters;

  saveFilters(filters: ApplicationRawFilters): void {
    this.tableService.saveFilters('applications-filters', filters);
  }

  restoreFilters(): ApplicationRawFilters {
    return this.tableService.restoreFilters<ApplicationRawEnumField, null>('applications-filters', this.filtersDefinitions) ?? this.defaultFilters;
  }

  resetFilters(): ApplicationRawFilters {
    this.tableService.resetFilters('applications-filters');

    return this.defaultFilters;
  }

  retrieveLabel(filterFor: FilterFor<ApplicationRawEnumField, null>, filterField:  ApplicationFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.rootField[filterField as ApplicationRawEnumField];
    case 'options':
      throw new Error('Impossible case');
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }

  retrieveFiltersDefinitions(): ApplicationsFiltersDefinition[] {
    return this.filtersDefinitions;
  }

  retrieveField(filterField: string): ApplicationFilterField  {
    const values = Object.values(this.rootField);
    const index = values.findIndex(value => value.toLowerCase() === filterField.toLowerCase());
    return { for: 'root', index: index };
  }
}
