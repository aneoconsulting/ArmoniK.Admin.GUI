import { FilterStringOperator, ListPartitionsResponse, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { Scope } from '@app/types/config';
import { ArmonikData, PartitionData } from '@app/types/data';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { GrpcSortFieldService } from '@services/grpc-sort-field.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsGrpcService } from '../services/partitions-grpc.service';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawListOptions } from '../types';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
  templateUrl: './table.component.html',
  providers: [
    PartitionsGrpcService,
    PartitionsIndexService,
    TasksByStatusService,
    FiltersService,
    GrpcSortFieldService,
  ],
  imports: [
    TableComponent,
  ]
})
export class PartitionsTableComponent extends AbstractTaskByStatusTableComponent<PartitionRaw, PartitionRawColumnKey, PartitionRawFieldKey, PartitionRawListOptions, PartitionRawEnumField>
  implements OnInit, AfterViewInit {
  
  readonly grpcService = inject(PartitionsGrpcService);
  readonly indexService = inject(PartitionsIndexService);
  
  scope: Scope = 'partitions';
  table: TableTasksByStatus = 'partitions';

  ngOnInit(): void {
    this.initTable();
  }

  ngAfterViewInit(): void {
    this.subscribeToData();
  }

  computeGrpcData(entries: ListPartitionsResponse): PartitionRaw[] | undefined {
    return entries.partitions;
  }

  isDataRawEqual(value: PartitionRaw, entry: PartitionRaw): boolean {
    return value.id === entry.id;
  }
  
  createNewLine(entry: PartitionRaw): PartitionData {
    return {
      raw: entry,
      queryTasksParams: this.createTasksByStatusQueryParams(entry.id),
      filters: this.countTasksByStatusFilters(entry.id),
    };
  }

  createTasksByStatusQueryParams(partition: string) {
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
          const taskField = this.#partitionToTaskFilter(filter.field as PartitionRawEnumField | null);
          if (taskField && filter.operator !== null && filter.value !== null) {
            const key = this.filtersService.createQueryParamsKey(index, 'options', filter.operator, taskField);
            params[key] = filter.value?.toString();
          }
        }
      });
    });
    return params;
  }

  #partitionToTaskFilter(field: PartitionRawEnumField | null) {
    switch (field) {
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID;
    case PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY:
      return TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PRIORITY;
    default:
      return null;
    }
  }

  countTasksByStatusFilters(partitionId: string): TaskSummaryFilters {
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

  trackBy(index: number, items: ArmonikData<PartitionRaw>) {
    return items.raw.id;
  }
}