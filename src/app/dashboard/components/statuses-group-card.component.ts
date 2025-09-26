import { FilterStringOperator, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { Filter, FilterInputValue } from '@app/types/filters';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersService } from '@services/filters.service';
import { StorageService } from '@services/storage.service';
import { TasksStatusesGroup } from '../types';

@Component({
  selector: 'app-statuses-group-card',
  templateUrl: 'statuses-group-card.component.html',
  styleUrl: 'statuses-group-card.component.css',
  providers: [
    DefaultConfigService,
    StorageService,
    {
      provide: StatusService,
      useClass: TasksStatusesService
    },
    FiltersService,
  ],
  imports: [
    RouterModule,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusesGroupCardComponent {
  @Input({ required: true }) group: TasksStatusesGroup;
  @Input({ required: true }) hideGroupHeaders: boolean;
  @Input({ required: true }) data: StatusCount[] = [];
  @Input({ required: true }) filters: TaskSummaryFilters;

  private readonly tasksStatusesService = inject(StatusService) as TasksStatusesService;
  private readonly filtersService = inject(FiltersService);

  statusToLabel(status: TaskStatus): StatusLabelColor {
    return this.tasksStatusesService.statusToLabel(status);
  }

  updateCounter(status: TaskStatus): number {
    const counter = this.data.find((statusCount) => statusCount.status === status);
    return counter?.count ?? 0;
  }

  sumStatusCount(status: TaskStatus[]): number {
    return this.data.reduce((acc, curr) => {
      if (status.includes(curr.status)) {
        return acc + curr.count;
      }

      return acc;
    }, 0);
  }

  createQueryParamManyStatuses() {
    if (this.filters.length === 0) {
      return this.createQueryParamManyStatusesSingleFilters();
    } 
    return this.createQueryParamManyStatusesManyFilters();
  }

  private createQueryParamManyStatusesSingleFilters() {
    const params: { [key: string]: FilterInputValue } = {};
    for (const [index, status] of this.group.statuses.entries()) {
      params[this.#createQueryParamKeyOr(index)] = status;
    }
    return params;
  }

  private createQueryParamManyStatusesManyFilters() {
    const params: { [key: string]: FilterInputValue } = {};
    let orGroup = 0;
    for (const status of this.group.statuses) {
      for (const filterAnd of this.filters) {
        for (const filter of filterAnd) {
          const filterLabel = this.#createQueryParamFilterKey(filter, orGroup);
          if (filterLabel) params[filterLabel] = filter.value;
        }
        params[this.#createQueryParamKeyOr(orGroup)] = status;
        orGroup++;
      }
    }
    return params;
  }

  createQueryParam(status: TaskStatus) {
    if (this.filters.length === 0) {
      return {
        [this.#createQueryParamKey()]: status,
      };
    }
    else {
      const params: { [key: string]: FilterInputValue } = {};
      for (const [index, filterAnd] of this.filters.entries()) {
        params[this.#createQueryParamKeyOr(index)] = status;
        for (const filter of filterAnd) {
          const filterLabel = this.#createQueryParamFilterKey(filter, index);
          if (filterLabel) {
            params[filterLabel] = filter.value;
          }
        }
      }

      return params;
    }
  }

  #createQueryParamKey(): string {
    return this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(1, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS);
  }

  #createQueryParamKeyOr(orGroup: number): string {
    return this.filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root', FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS);
  }

  #createQueryParamFilterKey(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>, orGroup: number): string | null {
    if (filter.field && filter.operator && filter.for) {
      return this.filtersService.createQueryParamsKey<TaskSummaryEnumField | TaskOptionEnumField>(orGroup, filter.for, filter.operator, (filter.field as TaskSummaryEnumField | TaskOptionEnumField));
    }
    return null;
  }
}
