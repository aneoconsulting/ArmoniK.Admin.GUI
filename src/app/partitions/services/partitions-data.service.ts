import { FilterStringOperator, ListPartitionsResponse, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Injectable, OnDestroy, inject } from '@angular/core';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { PartitionData } from '@app/types/data';
import { AbstractTableDataService } from '@app/types/services/table-data.service';
import { PartitionRaw } from '../types';
import { PartitionsGrpcService } from './partitions-grpc.service';

@Injectable()
export default class PartitionsDataService extends AbstractTableDataService<PartitionRaw, PartitionRawEnumField> implements OnDestroy {
  readonly grpcService = inject(PartitionsGrpcService);

  scope: Scope = 'partitions';

  ngOnDestroy(): void {
    this.onDestroy();
  }

  computeGrpcData(entries: ListPartitionsResponse): PartitionRaw[] | undefined {
    return entries.partitions;
  }

  createNewLine(entry: PartitionRaw): PartitionData {
    return {
      raw: entry,
      queryTasksParams: this.createTasksByStatusQueryParams(entry.id),
      filters: this.countTasksByStatusFilters(entry.id),
    };
  }

  /**
   * Create the queryParams used by the taskByStatus component to redirect to the task table.
   * The partitionId filter is applied on top of every filter of the table.
   */
  private createTasksByStatusQueryParams(partition: string) {
    if (this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: partition,
      };
    }
    const params: Record<string, string> = {};
    this.filters.forEach((filtersAnd, index) => {
      params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = partition;
      filtersAnd.forEach((filter) => {
        if (filter.field !== PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID || filter.operator !== FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL) {
          const taskField = this.partitionToTaskFilter(filter.field as PartitionRawEnumField | null);
          if (taskField && filter.operator !== null && filter.value !== null) {
            const key = this.filtersService.createQueryParamsKey(index, 'options', filter.operator, taskField);
            params[key] = filter.value?.toString();
          }
        }
      });
    });
    return params;
  }

  /**
   * Transforms a partition field into a TaskOptionField.
   */
  private partitionToTaskFilter(field: PartitionRawEnumField | null): TaskOptionEnumField | null {
    switch (field) {
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID;
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY;
    default:
      return null;
    }
  }

  /**
   * Create the filter used by the **TaskByStatus** component.
   */
  private countTasksByStatusFilters(partitionId: string): TaskSummaryFilters {
    return [
      [
        {
          for: 'options',
          field: TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID,
          value: partitionId,
          operator: FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL,
        }
      ]
    ];
  }
}