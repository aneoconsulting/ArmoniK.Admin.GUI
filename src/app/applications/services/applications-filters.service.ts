import { ApplicationRawEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable } from '@angular/core';
import { Scope } from '@app/types/config';
import { FilterFor } from '@app/types/filter-definition';
import { DataFilterService } from '@app/types/services/data-filter.service';
import { ApplicationFilterField, ApplicationRawFilters, ApplicationsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ApplicationsFiltersService extends DataFilterService<ApplicationRawEnumField> {
  protected readonly scope: Scope = 'applications';
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

  constructor() {
    super();
    this.getFromCache();
  }

  retrieveLabel(filterFor: FilterFor<ApplicationRawEnumField, null>, filterField:  ApplicationFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.rootField[filterField as ApplicationRawEnumField];
    default:
      console.error(`Unknown filter type: ${filterFor} ${filterField}`);
      return '';
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
