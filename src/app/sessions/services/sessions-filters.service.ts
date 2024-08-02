import { SessionRawEnumField, SessionStatus, SessionTaskOptionEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { FiltersServiceOptionsInterface, FiltersServiceStatusesInterface } from '@app/types/services/filtersService';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { SessionsStatusesService } from './sessions-statuses.service';
import { SessionFilterDefinition, SessionFilterField, SessionFilterFor, SessionRawFilters } from '../types';

@Injectable({
  providedIn: 'root',
})
export class SessionsFiltersService implements FiltersServiceOptionsInterface<SessionRawEnumField, TaskOptionEnumField>, FiltersServiceStatusesInterface {
  readonly statusService = inject(SessionsStatusesService);
  readonly defaultConfigService = inject(DefaultConfigService);
  readonly tableService = inject(TableService);

  readonly rootField: Record<SessionRawEnumField, string> = {
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_SESSION_ID]: $localize`Session ID`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_STATUS]: $localize`Status`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT]: $localize`Cancelled At`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT]: $localize`Created At`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DURATION]: $localize`Duration`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_OPTIONS]: $localize`Options`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PARTITION_IDS]: $localize`Partition Ids`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT]: $localize`Closed at`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DELETED_AT]: $localize`Deleted at`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PURGED_AT]: $localize`Purged at`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLIENT_SUBMISSION]: $localize`Client Submission`,
    [SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION]: $localize`Worker Submission`,
  };

  readonly optionsFields: Record<SessionTaskOptionEnumField, string> = {
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

  readonly filtersDefinitions: SessionFilterDefinition[] = [
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
      statuses: Object.keys(this.statusService.statuses).map(status => {
        return {
          key: status,
          value: this.statusService.statuses[Number(status) as SessionStatus],
        };
      }),
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CREATED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CANCELLED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLOSED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_DELETED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_PURGED_AT,
      type: 'date'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_CLIENT_SUBMISSION,
      type: 'boolean'
    },
    {
      for: 'root',
      field: SessionRawEnumField.SESSION_RAW_ENUM_FIELD_WORKER_SUBMISSION,
      type: 'boolean'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
      type: 'string'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY,
      type: 'number'
    },
    {
      for: 'options',
      field: SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES,
      type: 'number'
    },
  ];

  readonly defaultFilters: SessionRawFilters = this.defaultConfigService.defaultSessions.filters;

  saveFilters(filters: SessionRawFilters): void {
    this.tableService.saveFilters('sessions-filters', filters);
  }

  restoreFilters(): SessionRawFilters {
    return this.tableService.restoreFilters<SessionRawEnumField, SessionTaskOptionEnumField>('sessions-filters', this.filtersDefinitions) ?? this.defaultFilters;
  }

  resetFilters(): SessionRawFilters {
    this.tableService.resetFilters('sessions-filters');

    return this.defaultFilters;
  }

  saveShowFilters(showFilters: boolean): void {
    this.tableService.saveShowFilters('sessions-show-filters', showFilters);
  }

  restoreShowFilters(): boolean {
    return this.tableService.restoreShowFilters('sessions-show-filters') ?? true;
  }

  retrieveLabel(filterFor: SessionFilterFor, filterField: SessionFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.rootField[filterField as SessionRawEnumField];
    case 'options':
      return this.optionsFields[filterField as SessionTaskOptionEnumField];
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}`);
    }
  }

  retrieveFiltersDefinitions(): SessionFilterDefinition[] {
    return this.filtersDefinitions;
  }

  retrieveField(filterField: string): SessionFilterField {
    const rootValues = Object.values(this.rootField);
    let index = rootValues.findIndex(value => value.toLowerCase() === filterField.toLowerCase());

    if (index >= 0) {
      return { for: 'root', index: index };
    }

    const optionsValues = Object.values(this.optionsFields);
    index = optionsValues.findIndex(value => value.toLowerCase() === filterField.toLowerCase());
    return { for: 'options', index: index };
  }
}
