import { FilterStringOperator, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount, TaskSummaryFilters } from '@app/tasks/types';
import { Filter } from '@app/types/filters';
import { StatusLabelColor, StatusService } from '@app/types/status';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersService } from '@services/filters.service';
import { StorageService } from '@services/storage.service';
import { TasksStatusesGroup } from '../types';

@Component({
  selector: 'app-statuses-group-card',
  templateUrl: './statuses-group-card.component.html',
  styles: [`
mat-card {
  height: 100%;
}

mat-card-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul li a {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  color: inherit;
  text-decoration: none;
}
  `],
  standalone: true,
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
    const params: { [key: string]: string | number | Date | boolean | null } = {};
    let orGroup = 0;

    if (this.filters.length !== 0) {
      this.group.statuses.forEach((status) => {
        this.filters.forEach((filterAnd) => {
          filterAnd.forEach(filter => {
            const filterLabel = this.#createQueryParamFilterKey(filter, orGroup);
            if (filterLabel) params[filterLabel] = filter.value;
          });
          params[this.#createQueryParamKeyOr(orGroup)] = status;
          orGroup++;
        });
      });
    } else {
      this.group.statuses.forEach((status, index) => params[this.#createQueryParamKeyOr(index)] = status);
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
      const params: { [key: string]: string | number | Date | boolean | null } = {};

      this.filters.forEach((filterAnd, index) => {
        params[this.#createQueryParamKeyOr(index)] = status;
        filterAnd.forEach(filter => {
          const filterLabel = this.#createQueryParamFilterKey(filter, index);
          if (filterLabel) params[filterLabel] = filter.value;
        });
      });

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
