import { inject } from '@angular/core';
import { ApplicationFilterField, ApplicationFilterFor } from '@app/applications/types';
import { PartitionFilterField, PartitionFilterFor } from '@app/partitions/types';
import { ResultFilterField, ResultFilterFor } from '@app/results/types';
import { SessionFilterField, SessionFilterFor } from '@app/sessions/types';
import { TaskFilterField, TaskFilterFor } from '@app/tasks/types';
import { DefaultConfigService } from '@services/default-config.service';
import { FiltersCacheService } from '@services/filters-cache.service';
import { TableService } from '@services/table.service';
import { Scope } from '../config';
import { FilterDefinition } from '../filter-definition';
import { Filter, FiltersEnums, FiltersOptionsEnums, FiltersOr } from '../filters';
import { GroupConditions } from '../groups';
import { Status, StatusService } from '../status';

export type FilterFor = TaskFilterFor | ResultFilterFor | SessionFilterFor | PartitionFilterFor | ApplicationFilterFor;
export type FilterField = TaskFilterField | ResultFilterField | SessionFilterField | PartitionFilterField | ApplicationFilterField;

export abstract class DataFilterService<F extends FiltersEnums, O extends FiltersOptionsEnums | null = null> {
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

  getType(filter: Filter<F, O>) {
    return this.filtersDefinitions.find(definition => definition.field === filter.field && definition.for === filter.for)?.type;
  }

  saveGroups(groups: GroupConditions<F, O>[]) {
    this.tableService.saveGroups(`${this.scope}-groups`, groups);
  }

  restoreGroups() {
    return this.tableService.restoreGroups<F, O>(`${this.scope}-groups`);
  }

  resetGroups() {
    this.tableService.resetGroups(`${this.scope}-groups`);
  }

  abstract retrieveLabel(filterFor: FilterFor, filterField: FilterField): string;
  abstract retrieveField(filterField: string): FilterField;
}

export interface FiltersServiceOptionsInterface<O extends NonNullable<FiltersOptionsEnums>> {
  readonly optionsFields: Record<O, string>;
}

export interface FiltersServiceStatusesInterface<S extends Status> {
  readonly statusService: StatusService<S>;
}