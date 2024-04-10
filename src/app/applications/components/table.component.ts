import { ApplicationRawEnumField, FilterStringOperator, SessionTaskOptionEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { ApplicationData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { Page } from '@app/types/pages';
import { ActionTable } from '@app/types/table';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { ApplicationsIndexService } from '../services/applications-index.service';
import { ApplicationRaw, ApplicationRawColumnKey, ApplicationRawFilters, ApplicationRawListOptions } from '../types';

@Component({
  selector: 'app-application-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    ApplicationsIndexService,
    TasksByStatusService,
    MatDialog,
    FiltersService
  ],
  imports: [
    TableComponent,
  ]
})
export class ApplicationsTableComponent extends AbstractTaskByStatusTableComponent<ApplicationRaw, ApplicationRawColumnKey, ApplicationRawListOptions> implements OnInit {
  @Input({required: true}) filters: ApplicationRawFilters;
  table: TableTasksByStatus = 'applications';
  
  override readonly indexService = inject(ApplicationsIndexService);
  readonly iconsService = inject(IconsService);
  readonly router = inject(Router);

  seeSessions$ = new Subject<ApplicationData>();
  seeSessionsSubscription = this.seeSessions$.subscribe(data => this.router.navigate(['/sessions'], { queryParams: this.createViewSessionsQueryParams(data.raw.name, data.raw.version) }));

  actions: ActionTable<ApplicationData>[] = [
    {
      label: $localize`See session`,
      icon: this.getPageIcon('sessions'),
      action$: this.seeSessions$
    },
  ];
  
  isDataRawEqual(value: ApplicationRaw, entry: ApplicationRaw): boolean {
    return value.name === entry.name && value.version === entry.version;
  }

  createNewLine(entry: ApplicationRaw): ApplicationData {
    return {
      raw: entry,
      queryTasksParams: this.createTasksByStatusQueryParams(entry.name, entry.version),
      filters: this.countTasksByStatusFilters(entry.name, entry.version),
      value$: new Subject<ApplicationRaw>()
    };
  }

  getPageIcon(name: Page): string {
    return this.iconsService.getPageIcon(name);
  }

  createViewSessionsQueryParams(name: string, version: string) {
    return {
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
      [`0-options-${SessionTaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version,
    };
  }

  createTasksByStatusQueryParams(name: string, version: string) {
    if(this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: name,
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: version
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAME && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL) && 
          !(filter.field === ApplicationRawEnumField.APPLICATION_RAW_ENUM_FIELD_NAMESPACE && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createQueryParamFilterKey(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_NAME}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = name;
        params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_APPLICATION_VERSION}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = version;
      });
      return params;
    }
  }

  #createQueryParamFilterKey(filter: Filter<ApplicationRawEnumField, null>, orGroup: number): string | null {
    if (filter.field !== null && filter.operator !== null) {
      const taskField = this.#applicationsToTaskField(filter.field as ApplicationRawEnumField); // We transform it into an options filter for a task
      if (!taskField) return null;
      return this.filtersService.createQueryParamsKey<TaskOptionEnumField>(orGroup, 'options', filter.operator, taskField); 
    }
    return null;
  }

  #applicationsToTaskField(applicationField: ApplicationRawEnumField) {
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

  countTasksByStatusFilters(applicationName: string, applicationVersion: string): TaskSummaryFilters {
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