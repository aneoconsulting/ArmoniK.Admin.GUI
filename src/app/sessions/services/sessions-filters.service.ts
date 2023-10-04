import { SessionRawEnumField, SessionStatus, SessionTaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FilterValueOptions, FiltersAnd } from '@app/types/filters';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionsStatusesService } from './sessions-statuses.service';
import { SessionFilterField, SessionFilterFor, SessionRawFiltersOr } from '../types';
// import { SessionFilterDefinition, SessionFilterField, SessionFilterFor } from '../types';

/**
 *
 * `for` and `field` are used to identify the filter.
 */
type FilterDefinitionRootString<T extends number> = {
  for: 'root';
  field: T;
  type: 'string'
};

/**
 *
 * `for` and `field` are used to identify the filter.
 */
type FilterDefinitionRootNumber<T extends number> = {
  for: 'root';
  field: T;
  type: 'number'
};

/**
 *
 * `for` and `field` are used to identify the filter.
 */
type FilterDefinitionRootArray<T extends number> = {
  /**
   * Used to know which field comes from since it's just a number from an enum.
   */
  for: 'root';
  field: T;
  type: 'array';
};

/**
 *
 * `for` and `field` are used to identify the filter.
 */
type FilterDefinitionRootStatus<T extends number> = {
  /**
   * Used to know which field comes from since it's just a number from an enum.
   */
  for: 'root';
  field: T;
  type: 'status';
  statuses: FilterValueOptions;
};

type FilterDefinitionRoot<T extends number> = FilterDefinitionRootString<T> | FilterDefinitionRootNumber<T> | FilterDefinitionRootArray<T> | FilterDefinitionRootStatus<T>;

type FilterDefinitionTaskOptionString<T extends number | null> = {
  /**
   * Used to know which field comes from since it's just a number from an enum.
   */
  for: 'options';
  field: T;
  type: 'string';
};

type FilterDefinitionTaskOption<T extends number | null> = FilterDefinitionTaskOptionString<T>;

export type FilterDefinition<T extends number, U extends number | null = null> = FilterDefinitionRoot<T> | FilterDefinitionTaskOption<U>;

export type FilterFor<T extends number, U extends number | null = null> = FilterDefinition<T, U>['for'];

export abstract class FiltersService {
  abstract retrieveFiltersDefinitions<T extends number, U extends number | null = null>(): FilterDefinition<T, U>[];
  abstract retrieveLabel<T extends number, U extends number | null = null>(filterFor: FilterFor<T, U>, filterField: T | U): string;
  abstract saveFilters<T extends number, U extends number | null = null>(filters: FiltersAnd<T, U>[]): void;
  abstract restoreFilters<T extends number, U extends number | null = null>(): FiltersAnd<T, U>[];
  abstract resetFilters<T extends number, U extends number | null = null>(): FiltersAnd<T, U>[];
}

export type SessionFilterDefinition = FilterDefinition<SessionRawEnumField, SessionTaskOptionEnumField>;

@Injectable({
  providedIn: 'root',
})
export class SessionsFiltersService {
  readonly #sessionsStatusesService = inject(SessionsStatusesService);
  readonly #defaultConfigService = inject(DefaultConfigService);
  readonly #tableService = inject(TableService);

  readonly #rootField: Record<SessionRawEnumField, string> = {
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID]: $localize`Session ID`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS]: $localize`Status`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT]: $localize`Cancelled At`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT]: $localize`Created At`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION]: $localize`Duration`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_OPTIONS]: $localize`Options`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS]: $localize`Partition IDs`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
  };

  readonly #optionsField: Record<SessionTaskOptionEnumField, string> = {
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION]: $localize`Max Duration`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES]: $localize`Max Retries`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY]: $localize`Priority`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID]: $localize`Partition ID`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME]: $localize`Application Name`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION]: $localize`Application Version`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE]: $localize`Application Namespace`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE]: $localize`Application Service`,
    [SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE]: $localize`Engine Type`,
  };

  readonly #filtersDefinitions: SessionFilterDefinition[] = [
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS,
      type: 'array',
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS,
      type: 'status',
      statuses: Object.keys(this.#sessionsStatusesService.statuses).map(status => {
        return {
          key: status,
          value: this.#sessionsStatusesService.statuses[Number(status) as SessionStatus],
        };
      }),
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      type: 'number'
    }

  ];

  readonly #defaultFilters: SessionRawFiltersOr = this.#defaultConfigService.defaultSessions.filters;

  saveFilters(filters: SessionRawFiltersOr): void {
    this.#tableService.saveFilters('sessions-filters', filters);
  }

  restoreFilters(): SessionRawFiltersOr {
    return this.#tableService.restoreFilters<SessionRawEnumField, SessionTaskOptionEnumField>('sessions-filters', this.#filtersDefinitions) ?? this.#defaultFilters;
  }

  resetFilters(): SessionRawFiltersOr {
    this.#tableService.resetFilters('sessions-filters');

    return this.#defaultFilters;
  }

  retrieveFiltersDefinitions() {
    return this.#filtersDefinitions;
  }

  retrieveLabel(filterFor: SessionFilterFor, filterField:  SessionFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.#rootField[filterField as SessionRawEnumField];
    case 'options':
      return this.#optionsField[filterField as SessionTaskOptionEnumField];
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }
}
