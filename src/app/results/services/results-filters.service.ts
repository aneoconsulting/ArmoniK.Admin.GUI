import { ResultRawEnumField, ResultStatus } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FilterFor } from '@app/types/filter-definition';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { ResultsStatusesService } from './results-statuses.service';
import { ResultFilterField, ResultRawFiltersOr, ResultsFiltersDefinition } from '../types';

@Injectable({
  providedIn: 'root'
})
export class ResultsFiltersService {
  readonly #resultsStatusesService = inject(ResultsStatusesService);
  readonly #defaultConfigService = inject(DefaultConfigService);
  readonly #tableService = inject(TableService);

  readonly #rootField: Record<ResultRawEnumField, string> = {
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_COMPLETED_AT]: $localize`Completed at`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT]: $localize`Created at`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_NAME]: $localize`Name`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID]: $localize`Owner Task ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_RESULT_ID]: $localize`Result ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID]: $localize`Session ID`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS]: $localize`Status`,
    [ResultRawEnumField.RESULT_RAW_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
  };

  readonly #filtersDefinitions: ResultsFiltersDefinition[] = [
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
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_STATUS,
      type: 'status',
      statuses: Object.keys(this.#resultsStatusesService.statuses).map(status => {
        return {
          key: status,
          value: this.#resultsStatusesService.statuses[Number(status) as ResultStatus],
        };
      }),
    },
    {
      for: 'root',
      field: ResultRawEnumField.RESULT_RAW_ENUM_FIELD_CREATED_AT,
      type: 'date'
    }
  ];

  readonly #defaultFilters: ResultRawFiltersOr = this.#defaultConfigService.defaultResults.filters;

  saveFilters(filters: ResultRawFiltersOr): void {
    this.#tableService.saveFilters('results-filters', filters);
  }

  restoreFilters(): ResultRawFiltersOr {
    return this.#tableService.restoreFilters<ResultRawEnumField, null>('results-filters', this.#filtersDefinitions) ?? this.#defaultFilters;
  }

  resetFilters(): ResultRawFiltersOr {
    this.#tableService.resetFilters('results-filters');

    return this.#defaultFilters;
  }

  retrieveFiltersDefinitions() {
    return this.#filtersDefinitions;
  }

  retrieveLabel(filterFor: FilterFor<ResultRawEnumField, null>, filterField:  ResultFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.#rootField[filterField as ResultRawEnumField];
    case 'options':
      throw new Error('Impossible case');
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }
}
