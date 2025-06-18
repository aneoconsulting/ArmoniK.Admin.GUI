import { ApplicationRawEnumField, FilterStringOperator, ListApplicationsResponse, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { ApplicationData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { AbstractTableDataService } from '@app/types/services/table-data.service';
import { ApplicationRaw } from '../types';
import { ApplicationsGrpcService } from './applications-grpc.service';

@Injectable()
export default class ApplicationsDataService extends AbstractTableDataService<ApplicationRaw, ApplicationRawEnumField> implements OnDestroy {
  readonly grpcService = inject(ApplicationsGrpcService);

  scope: Scope = 'applications';

  ngOnDestroy(): void {
    this.onDestroy();
  }

  computeGrpcData(entries: ListApplicationsResponse): ApplicationRaw[] | undefined {
    return entries.applications;
  }

  createNewLine(entry: ApplicationRaw): ApplicationData {
    return {
      raw: entry,
      queryTasksParams: this.createTasksByStatusQueryParams(entry.name, entry.version),
      filters: this.countTasksByStatusFilters(entry.name, entry.version),
    };
  }

  /**
   * Create the queryParams used by the taskByStatus component to redirect to the task table.
   * The applicationName and applicationVersion filter are applied on top of every filter of the table.
   */
  private createTasksByStatusQueryParams(name: string, version: string) {
    if(this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = name;
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = version;
        filterAnd.forEach(filter => {
          if ((filter.field !== ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME || filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL) && 
          (filter.field !== ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE || filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.createQueryParamFilterKey(filter, index);
            if (filterLabel && filter.value) {
              params[filterLabel] = filter.value.toString();
            }
          }
        });

      });
      return params;
    }
  }

  /**
   * Create the filter key used by the query params.
   */
  private createQueryParamFilterKey(filter: Filter<ApplicationRawEnumField, null>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null && filter.value !== null) {
      const taskField = this.applicationsToTaskField(filter.field as ApplicationRawEnumField); // We transform it into an options filter for a task
      if (taskField) {
        return this.filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, taskField); 
      } else {
        return null;
      }
    }
    return null;
  }

  /**
   * Transforms a application field into a TaskOptionField.
   */
  private applicationsToTaskField(applicationField: ApplicationRawEnumField) {
    switch (applicationField) {
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAMESPACE;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_SERVICE:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_SERVICE;
    case ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_VERSION:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION;
    default:
      return null;
    }
  }

  /**
   * Create the filter used by the **TaskByStatus** component.
   */
  private countTasksByStatusFilters(applicationName: string, applicationVersion: string): TaskSummaryFilters {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME,
          value: applicationName,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        },
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION,
          value: applicationVersion,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL
        }
      ]
    ];
  }
}