import { ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Scope } from '@app/types/config';
import { FilterFor } from '@app/types/filter-definition';
import { AbstractFilterService, FiltersServiceStatusesInterface } from '@app/types/services/filtersService';
import { ResultsStatusesService } from './results-statuses.service';
import { ResultFilterField, ResultRawFilters, ResultsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ResultsFiltersService extends AbstractFilterService<ResultRawEnumField> implements FiltersServiceStatusesInterface {
  protected readonly scope: Scope = 'results';
  readonly statusService = inject(ResultsStatusesService);

  readonly rootField: Record<ResultRawEnumField, string> = {
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT]: $localize`Completed at`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT]: $localize`Created at`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_BY]: $localize`Created By`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME]: $localize`Name`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID]: $localize`Owner Task ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID]: $localize`Result ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID]: $localize`Session ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS]: $localize`Status`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE]: $localize`Size`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
  };

  readonly filtersDefinitions: ResultsFiltersDefinition[] = [
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME,
      type: 'string',
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID,
      type: 'string'
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_BY,
      type: 'string',
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
      type: 'status',
      statuses: Object.keys(this.statusService.statuses).map(status => {
        return {
          key: status,
          value: this.statusService.statuses[Number(status) as ResultStatus],
        };
      }),
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SIZE,
      type: 'number'
    }
  ];

  readonly defaultFilters: ResultRawFilters = this.defaultConfigService.defaultResults.filters;

  retrieveLabel(filterFor: FilterFor<ResultRawEnumField, null>, filterField:  ResultFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.rootField[filterField as ResultRawEnumField];
    case 'options':
      throw new Error('Impossible case');
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }

  retrieveFiltersDefinitions(): ResultsFiltersDefinition[] {
    return this.filtersDefinitions;
  }

  retrieveField(filterField: string): ResultFilterField  {
    const values = Object.values(this.rootField);
    const index = values.findIndex(value => value.toLowerCase() === filterField.toLowerCase());
    return { for: 'root', index: index };
  }
}
