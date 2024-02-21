import { FilterStringOperator, PartitionRawEnumField, TaskOptionEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { TaskSummaryFilters } from '@app/tasks/types';
import { Scope } from '@app/types/config';
import { PartitionData } from '@app/types/data';
import { Filter } from '@app/types/filters';
import { CountTasksByStatusComponent } from '@components/count-tasks-by-status.component';
import { FiltersToolbarComponent } from '@components/filters/filters-toolbar.component';
import { TableEmptyDataComponent } from '@components/table/table-empty-data.component';
import { TableInspectObjectComponent } from '@components/table/table-inspect-object.component';
import { AbstractTableComponent } from '@components/table/table.abstract.component';
import { TableActionsToolbarComponent } from '@components/table-actions-toolbar.component';
import { TableContainerComponent } from '@components/table-container.component';
import { EmptyCellPipe } from '@pipes/empty-cell.pipe';
import { FiltersService } from '@services/filters.service';
import { IconsService } from '@services/icons.service';
import { TasksByStatusService } from '@services/tasks-by-status.service';
import { PartitionRaw, PartitionRawColumnKey, PartitionRawFilters } from '../types';

@Component({
  selector: 'app-partitions-table',
  standalone: true,
  templateUrl: './table.component.html',
  styles: [],
  providers: [
    TasksByStatusService,
    IconsService,
    FiltersService
  ],
  imports: [
    TableActionsToolbarComponent,
    FiltersToolbarComponent,
    TableContainerComponent,
    MatPaginatorModule,
    TableEmptyDataComponent,
    MatMenuModule,
    CountTasksByStatusComponent,
    MatSortModule,
    NgFor,
    NgIf,
    MatTableModule,
    MatIconModule,
    RouterModule,
    EmptyCellPipe,
    DragDropModule,
    MatButtonModule,
    TableInspectObjectComponent,
    MatDialogModule,
  ]
})
export class PartitionsTableComponent extends AbstractTableComponent<PartitionRawColumnKey, PartitionRaw, PartitionRawFilters> {
  tableScope: Scope = 'partitions';
  readonly #filtersService = inject(FiltersService);

  _data: PartitionData[] = [];

  get data() {
    return this._data;
  }

  @Input({ required: true }) set inputData(entries: PartitionRaw[]) {
    this._data = [];
    entries.forEach(entry => {
      const task: PartitionData = {
        raw: entry,
        queryTasksParams: this.createTasksByStatusQueryParams(entry.id),
        filters: this.countTasksByStatusFilters(entry.id)
      };
      this._data.push(task);
    });
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
          const key = this.#filtersService.createQueryParamsKey(index, 'options', filter.operator, taskField);
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