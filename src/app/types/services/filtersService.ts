import { inject } from '@angular/core';
import { ApplicationFilterField, ApplicationFilterFor } from '@app/applications/types';
import { PartitionFilterField, PartitionFilterFor } from '@app/partitions/types';
import { ResultsStatusesService } from '@app/results/services/results-statuses.service';
import { ResultFilterField, ResultFilterFor } from '@app/results/types';
import { SessionsStatusesService } from '@app/sessions/services/sessions-statuses.service';
import { SessionFilterField, SessionFilterFor } from '@app/sessions/types';
import { TasksStatusesService } from '@app/tasks/services/tasks-statuses.service';
import { TaskFilterField, TaskFilterFor } from '@app/tasks/types';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { Scope } from '../config';
import { FilterDefinition } from '../filter-definition';
import { FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';

type StatusesService = TasksStatusesService | ResultsStatusesService | SessionsStatusesService;
export type FilterFor = TaskFilterFor | ResultFilterFor | SessionFilterFor | PartitionFilterFor | ApplicationFilterFor;
export type FilterField = TaskFilterField | ResultFilterField | SessionFilterField | PartitionFilterField | ApplicationFilterField;

export abstract class AbstractFilterService<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
  protected abstract readonly scope: Scope;
  protected readonly defaultConfigService = inject(DefaultConfigService);
  private readonly tableService = inject(TableService);
  private readonly filtersCacheService = inject(FiltersCacheService);

  abstract readonly rootField: Record<F, string>;
  abstract readonly filtersDefinitions: FilterDefinition<F, O>[];

  abstract readonly defaultFilters: FiltersOr<F, O>;

  protected getFromCache() {
    const filters = this.filtersCacheService.get<F, O>(this.scope);
    if (filters) {
      this.saveFilters(filters);
    }
  }

  saveFilters(filters: FiltersOr<F, O>): void {
    this.tableService.saveFilters(`${this.scope}-filters`, filters);
  }

  restoreFilters(): FiltersOr<F, O> {
    return this.tableService.restoreFilters<F, O>(`${this.scope}-filters`, this.filtersDefinitions) ?? this.defaultFilters;
  }

  resetFilters(): FiltersOr<F, O> {
    this.tableService.resetFilters(`${this.scope}-filters`);

    return this.defaultFilters;
  }
  
  saveShowFilters(showFilters: boolean): void {
    this.tableService.saveShowFilters(`${this.scope}-show-filters`, showFilters);
  }

  restoreShowFilters(): boolean {
    return this.tableService.restoreShowFilters(`${this.scope}-show-filters`) ?? true;
  }

  abstract retrieveLabel(filterFor: FilterFor, filterField: FilterField): string;
}

export interface FiltersServiceOptionsInterface<O extends NonNullable<FiltersOptionsEnums>> {
  readonly optionsFields: Record<O, string>;
}

export interface FiltersServiceStatusesInterface {
  readonly statusService: StatusesService;
}