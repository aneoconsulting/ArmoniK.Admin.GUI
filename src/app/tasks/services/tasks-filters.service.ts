import { TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { DefaultConfigService } from '@services/default-config.service';
import { TableService } from '@services/table.service';
import { TasksStatusesService } from './tasks-status.service';
import { TaskFilterDefinition, TaskFilterField, TaskFilterFor, TaskSummaryFiltersOr } from '../types';

@Injectable({
  providedIn: 'root'
})
export class TasksFiltersService {
  readonly #tasksStatusesService = inject(TasksStatusesService);
  readonly #defaultConfigService = inject(DefaultConfigService);
  readonly #tableService = inject(TableService);

  readonly #rootField: Record<TaskSummaryEnumField, string> = {
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID]: $localize`Task ID`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID]: $localize`Session ID`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_OWNER_POD_ID]: $localize`Owner Pod ID`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID]: $localize`Initial Task ID`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS]: $localize`Status`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATED_AT]: $localize`Created at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SUBMITTED_AT]: $localize`Submitted at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STARTED_AT]: $localize`Started at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ENDED_AT]: $localize`Ended at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_CREATION_TO_END_DURATION]: $localize`Creation to End Duration`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_PROCESSING_TO_END_DURATION]: $localize`Processing to End Duration`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_TTL]: $localize`Pod TTL`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_POD_HOSTNAME]: $localize`Pod Hostname`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_RECEIVED_AT]: $localize`Received at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ACQUIRED_AT]: $localize`Acquired at`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_ERROR]: $localize`Error`,
    [TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
  };

  readonly #optionsField: Record<TaskOptionEnumField, string> = {
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_UNSPECIFIED]: $localize`Unspecified`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_DURATION]: $localize`Max Duration`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_MAX_RETRIES]: $localize`Max Retries`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY]: $localize`Priority`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID]: $localize`Partition ID`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME]: $localize`Application Name`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION]: $localize`Application Version`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE]: $localize`Application Namespace`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE]: $localize`Application Service`,
    [TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_ENGINE_TYPE]: $localize`Engine Type`,
  };


  readonly #filtersDefinitions: TaskFilterDefinition[] = [
    // Do not filter object fields
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_INITIAL_TASK_ID,
      type: 'string',
    },
    {
      for: 'root',
      field: TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS,
      type: 'status',
      statuses: Object.keys(this.#tasksStatusesService.statuses).map(status => {
        return {
          key: status,
          value: this.#tasksStatusesService.statuses[Number(status) as TaskStatus],
        };
      }),
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
      type: 'string',
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
      type: 'string',
    },
    {
      for: 'options',
      field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
      type: 'string',
    }
  ];

  readonly #defaultFilters: TaskSummaryFiltersOr = this.#defaultConfigService.defaultTasks.filters;

  saveFilters(filters: TaskSummaryFiltersOr): void {
    this.#tableService.saveFilters('sessions-filters', filters);
  }

  restoreFilters(): TaskSummaryFiltersOr {
    return this.#tableService.restoreFilters<TaskSummaryEnumField, TaskOptionEnumField>('sessions-filters', this.#filtersDefinitions) ?? this.#defaultFilters;
  }

  resetFilters(): TaskSummaryFiltersOr {
    this.#tableService.resetFilters('sessions-filters');

    return this.#defaultFilters;
  }

  retrieveFiltersDefinitions() {
    return this.#filtersDefinitions;
  }

  retrieveLabel(filterFor: TaskFilterFor, filterField:  TaskFilterField): string {
    switch (filterFor) {
    case 'root':
      return this.#rootField[filterField as TaskSummaryEnumField];
    case 'options':
      return this.#optionsField[filterField as TaskOptionEnumField];
    default:
      throw new Error(`Unknown filter type: ${filterFor} ${filterField}}`);
    }
  }
}
