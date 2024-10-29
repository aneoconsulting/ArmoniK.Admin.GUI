import { FilterStringOperator, ListTasksResponse, ResultRawEnumField, TaskOptionEnumField, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, inject } from '@angular/core';
import { Scope } from '@app/types/config';
import { TaskData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { AbstractTableDataService } from '@app/types/services/table-data.service';
import { catchError, of } from 'rxjs';
import { TaskOptions, TaskSummary } from '../types';
import { TasksGrpcService } from './tasks-grpc.service';

@Injectable()
export default class TasksDataService extends AbstractTableDataService<TaskSummary, TaskSummaryEnumField, TaskOptions, TaskOptionEnumField> {
  readonly grpcService = inject(TasksGrpcService);

  scope: Scope = 'tasks';

  computeGrpcData(entries: ListTasksResponse): TaskSummary[] | undefined {
    return entries.tasks;
  }

  createNewLine(entry: TaskSummary): TaskData {
    return {
      raw: entry,
      resultsQueryParams: this.createResultsQueryParams(entry.id),
    };
  }

  /**
   * Create the Params required to go to the result page and filtering it on the **ownerTaskId** Field.
   */
  createResultsQueryParams(taskId: string) {
    if (this.filters.length === 0) {
      const keyTask = this.filtersService.createQueryParamsKey<ResultRawEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);

      return {
        [keyTask]: taskId
      };
    } else {
      const params: Record<string, string> = {};
      this.filters.forEach((filterAnd, index) => {
        filterAnd.forEach(filter => {
          if (!(filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID && filter.operator === FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL)) {
            const filterLabel = this.#createResultFilterLabel(filter, index);
            if (filterLabel && filter.value) params[filterLabel] = filter.value.toString();
          }
        });
        params[`${index}-root-${ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = taskId;
      });
      return params;
    }
  }

  /**
   * Transform an applied filter into a query param adapted to the result page.
   * 
   * Fields supported:
   * - **ownerTaskId**
   * - **sessionId**
   */
  #createResultFilterLabel(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>, orGroup: number) {
    if (filter.field !== null && filter.operator !== null) {
      if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_TASK_ID) {
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_OWNER_TASK_ID);
      } else if (filter.field === TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_SESSION_ID) {
        return this.filtersService.createQueryParamsKey<ResultRawEnumField>(orGroup, 'root', filter.operator, ResultRawEnumField.RESULT_RAW_ENUM_FIELD_SESSION_ID);
      }
    }
    return null;
  }

  cancelTasks(ids: string[]) {
    this.grpcService.cancel$(ids)
      .pipe(
        catchError((error) => {
          this.error(error, 'Could not cancel Tasks');
          return of(null);
        })
      ).subscribe((data) => {
        if (data) {
          this.success('Tasks cancelled');
        }
      });
  }

  cancelTask(id: string) {
    this.cancelTasks([id]);
  }
}