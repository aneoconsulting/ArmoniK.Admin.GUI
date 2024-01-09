import { FilterStringOperator, TaskOptionEnumField, TaskStatus, TaskSummaryEnumField } from '@aneoconsultingfr/armonik.api.angular';
import { NgFor, NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { StatusCount, TaskSummaryFiltersOr } from '@app/tasks/types';
import { Filter } from '@app/types/filters';
import { FiltersService } from '@services/filters.service';
import { TasksStatusesGroup } from '../types';

@Component({
  selector: 'app-statuses-group-card',
  template: `
<mat-card>
  <mat-card-header *ngIf="!hideGroupHeaders">
    <mat-card-title>
      <a routerLink="/tasks" [queryParams]="createQueryParamManyStatuses()" [style]="'color:' + group.color + '; text-decoration: none'">
        {{ group.name }}
      </a>
      <span>
        {{ sumStatusCount(group.statuses) }}
      </span>
    </mat-card-title>
  </mat-card-header>
  <mat-card-content>
    <ul>
      <li *ngFor="let status of group.statuses">
        <a routerLink="/tasks" [queryParams]="createQueryParam(status)">
          <span>
            {{ statusToLabel(status) }}
          </span>
          <span>
            {{ updateCounter(status) }}
          </span>
        </a>
      </li>
    </ul>
  </mat-card-content>
</mat-card>
  `,
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
    TasksStatusesService,
    FiltersService,
  ],
  imports: [
    NgFor,
    NgIf,
    RouterModule,
    MatCardModule,
  ]
})
export class StatusesGroupCardComponent {
  @Input({ required: true }) group: TasksStatusesGroup;
  @Input({ required: true }) hideGroupHeaders: boolean;
  @Input({ required: true }) data: StatusCount[] = [];
  @Input({required: true}) filters: TaskSummaryFiltersOr;

  #tasksStatusesService = inject(TasksStatusesService);
  #filtersService = inject(FiltersService);

  statusToLabel(status: TaskStatus): string {
    return this.#tasksStatusesService.statusToLabel(status);
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
    const params: { [key: string]: string | number | Date | null} = {};
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
    if(this.filters.length === 0) {
      return {
        [this.#createQueryParamKey()]: status,
      };
    }
    else {
      const params: { [key: string]: string | number | Date | null} = {};

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
    return this.#filtersService.createQueryParamsKey<TaskSummaryEnumField>(1, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS);
  }

  #createQueryParamKeyOr(orGroup: number): string {
    return this.#filtersService.createQueryParamsKey<TaskSummaryEnumField>(orGroup, 'root' , FilterStringOperator.FILTER_STRING_OPERATOR_EQUAL, TaskSummaryEnumField.TASK_SUMMARY_ENUM_FIELD_STATUS);
  }

  #createQueryParamFilterKey(filter: Filter<TaskSummaryEnumField, TaskOptionEnumField>, orGroup: number): string | null {
    if (filter.field && filter.operator && filter.for) {
      return this.#filtersService.createQueryParamsKey<TaskSummaryEnumField | TaskOptionEnumField>(orGroup, filter.for, filter.operator, (filter.field as TaskSummaryEnumField | TaskOptionEnumField));
    }
    return null;
  }
}
