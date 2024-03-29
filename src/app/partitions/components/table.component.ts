import { FilterStringOperator, ListPartitionsResponse, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { Component, OnInit, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { TaskSummaryFilters } from '@app/tasks/types';
import { AbstractTaskByStatusTableComponent } from '@app/types/components/table';
import { PartitionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { TableComponent } from '@components/table/table.component';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TableTasksByStatus, TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionsGrpcService } from '../services/partitions-grpc.service';
import { PartitionsIndexService } from '../services/partitions-index.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters, PartitionRawListOptions } from '../types';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
  templateUrl: './table.component.html',
  styles: [

  ],
  providers: [
    PartitionsGrpcService,
    PartitionsIndexService,
    TasksByStatusService,
    IconsService,
    FiltersService
  ],
  imports: [
    RouterModule,
    MatDialogModule,
    TableComponent,
  ]
})
export class PartitionsTableComponent extends AbstractTaskByStatusTableComponent<PartitionRaw, PartitionRawColumnKey, PartitionRawListOptions, PartitionRawFilters> implements OnInit {
  
  readonly _grpcService = inject(PartitionsGrpcService);
  readonly indexService = inject(PartitionsIndexService);
  readonly iconsService = inject(IconsService);
  
  table: TableTasksByStatus = 'partitions';

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
      value$: new Subject<PartitionRaw>()
    };
  }

  getIcon(name: string): string {
    return this.iconsService.getIcon(name);
  }

  createTasksByStatusQueryParams(partition: string) {
    if (this.filters.length === 0) {
      return {
        [`0-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`]: partition,
      };
    }
    const params: Record<string, string> = {};
    this.filters.forEach((filtersAnd, index) => {
      filtersAnd.filter(filter => this.#isTaskFilter(filter)).forEach((filter) => {
        const taskField = this.#partitionToTaskFilter(filter.field as PartitionRawEnumField | null);
        if (taskField && filter.operator !== null && filter.value !== null) {
          const key = this.filtersService.createQueryParamsKey(index, 'options', filter.operator, taskField);
          params[key] = filter.value?.toString();
        }
      });
      params[`${index}-options-${TaskOptionEnumField.TASK_OPTION_ENUM_FIELD_PARTITION_ID}-${FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL}`] = partition;
    });
    return params;
  }

  #isTaskFilter(filter: Filter<PartitionRawEnumField, null>): boolean {
    return filter.field === PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_ID || filter.field === PartitionRawEnumField.PARTITION_RAW_ENUM_FIELD_PRIORITY;
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
}